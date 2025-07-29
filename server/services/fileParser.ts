import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

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
    // Using pdf-parse library
    const pdfParse = require("pdf-parse");
    const buffer = await readFile(filePath);
    const data = await pdfParse(buffer);
    
    if (!data.text || data.text.trim().length === 0) {
      throw new Error("PDF appears to be empty or contains no readable text");
    }
    
    return data.text;
  } catch (error) {
    if (error instanceof Error && error.message.includes("pdf-parse")) {
      throw new Error("Unable to parse PDF file. Please ensure it contains readable text and is not password protected.");
    }
    throw error;
  }
}

async function parseDOCX(filePath: string): Promise<string> {
  try {
    // Using mammoth library
    const mammoth = require("mammoth");
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
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  return allowedTypes.includes(mimeType);
}
