import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { jobDetailsSchema, type OptimizationResult } from "@shared/schema";
import { parseResumeFile, validateFileSize, validateFileType } from "./services/fileParser";
import { analyzeResumeATS, optimizeResume, generateCoverLetter } from "./services/gemini";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (validateFileType(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only DOCX files are currently supported."));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Upload resume and create job application
  app.post("/api/upload-resume", upload.single("resume"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No resume file uploaded" });
      }

      // Validate file size
      if (!validateFileSize(req.file.size)) {
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "File size too large. Maximum size is 10MB." });
      }

      // Parse job details from request body
      const jobDetails = jobDetailsSchema.parse(JSON.parse(req.body.jobDetails || "{}"));

      // Parse resume file
      const resumeText = await parseResumeFile(req.file.path, req.file.mimetype);

      // Create job application record
      const application = await storage.createJobApplication({
        companyName: jobDetails.companyName,
        roleTitle: jobDetails.roleTitle,
        jobDescription: jobDetails.jobDescription,
        originalResumeText: resumeText,
        originalResumeFilename: req.file.originalname,
        optimizedResume: null,
        coverLetter: null,
        originalAtsScore: null,
        optimizedAtsScore: null,
        matchedKeywords: null,
        missingKeywords: null,
        recommendations: null,
      });

      // Clean up uploaded file
      fs.unlinkSync(req.file.path);

      res.json({ 
        applicationId: application.id,
        message: "Resume uploaded and parsed successfully",
        resumeText: resumeText.substring(0, 500) + "..." // Return preview
      });

    } catch (error) {
      // Clean up file if it exists
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      console.error("Upload error:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to upload and parse resume" 
      });
    }
  });

  // Analyze original resume ATS score
  app.post("/api/analyze-original/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const application = await storage.getJobApplication(id);

      if (!application) {
        return res.status(404).json({ message: "Job application not found" });
      }

      // Analyze original resume
      const analysis = await analyzeResumeATS(
        application.originalResumeText,
        application.jobDescription
      );

      // Update application with analysis results
      await storage.updateJobApplication(id, {
        originalAtsScore: analysis.score,
        matchedKeywords: analysis.matchedKeywords,
        missingKeywords: analysis.missingKeywords,
        recommendations: analysis.recommendations,
      });

      res.json({
        score: analysis.score,
        matchedKeywords: analysis.matchedKeywords,
        missingKeywords: analysis.missingKeywords,
        recommendations: analysis.recommendations,
      });

    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to analyze resume" 
      });
    }
  });

  // Generate optimized resume and cover letter
  app.post("/api/optimize/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const application = await storage.getJobApplication(id);

      if (!application) {
        return res.status(404).json({ message: "Job application not found" });
      }

      // Generate optimized resume
      const optimizedResumeText = await optimizeResume(
        application.originalResumeText,
        application.jobDescription,
        application.companyName,
        application.roleTitle
      );

      // Generate cover letter
      const coverLetterText = await generateCoverLetter(
        application.originalResumeText,
        application.jobDescription,
        application.companyName,
        application.roleTitle
      );

      // Analyze optimized resume
      const optimizedAnalysis = await analyzeResumeATS(
        optimizedResumeText,
        application.jobDescription
      );

      // Update application with generated content
      const updatedApplication = await storage.updateJobApplication(id, {
        optimizedResume: optimizedResumeText,
        coverLetter: coverLetterText,
        optimizedAtsScore: optimizedAnalysis.score,
      });

      const result: OptimizationResult = {
        optimizedResume: optimizedResumeText,
        coverLetter: coverLetterText,
        originalAnalysis: {
          score: application.originalAtsScore || 0,
          matchedKeywords: application.matchedKeywords || [],
          missingKeywords: application.missingKeywords || [],
          recommendations: application.recommendations || [],
        },
        optimizedAnalysis: {
          score: optimizedAnalysis.score,
          matchedKeywords: optimizedAnalysis.matchedKeywords,
          missingKeywords: optimizedAnalysis.missingKeywords,
          recommendations: optimizedAnalysis.recommendations,
        },
      };

      res.json(result);

    } catch (error) {
      console.error("Optimization error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to optimize resume and generate cover letter" 
      });
    }
  });

  // Get job application details
  app.get("/api/application/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const application = await storage.getJobApplication(id);

      if (!application) {
        return res.status(404).json({ message: "Job application not found" });
      }

      res.json(application);

    } catch (error) {
      console.error("Get application error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to retrieve job application" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
