import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";
import mammoth from "mammoth";

const readFile = promisify(fs.readFile);

export async function parseResumeFile(filePath: string, mimeType: string): Promise<string> {
  try {
    if (mimeType === "application/pdf") {
      return await parsePDF(filePath);
    } else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      return await parseDOCX(filePath);
    } else {
      throw new Error("Unsupported file format. Please upload PDF or DOCX files only.");
    }
  } catch (error) {
    console.error("File parsing error:", error);
    throw new Error(`Failed to parse resume file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function parsePDF(filePath: string): Promise<string> {
  try {
    // For now, we'll provide a fallback for PDF parsing
    // In a production environment, you would want to use a robust PDF parsing library
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      throw new Error("PDF file is empty");
    }
    
    // Return a message indicating PDF parsing needs to be implemented with proper library
    throw new Error("PDF parsing is temporarily unavailable. Please upload a DOCX file instead, or contact support for PDF processing.");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unable to parse PDF file. Please ensure it contains readable text and is not password protected.");
  }
}

async function parseDOCX(filePath: string): Promise<string> {
  try {
    const buffer = await readFile(filePath);
    const result = await mammoth.extractRawText({ buffer });
    
    if (!result.value || result.value.trim().length === 0) {
      throw new Error("DOCX appears to be empty or contains no readable text");
    }
    
    return result.value;
  } catch (error) {
    if (error instanceof Error && error.message.includes("mammoth")) {
      throw new Error("Unable to parse DOCX file. Please ensure it's a valid Word document.");
    }
    throw error;
  }
}

export function validateFileSize(fileSize: number, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return fileSize <= maxSizeBytes;
}

export function validateFileType(mimeType: string): boolean {
  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  return allowedTypes.includes(mimeType);
}
