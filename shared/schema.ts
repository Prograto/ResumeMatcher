import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const jobApplications = pgTable("job_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  roleTitle: text("role_title").notNull(),
  jobDescription: text("job_description").notNull(),
  originalResumeText: text("original_resume_text").notNull(),
  originalResumeFilename: text("original_resume_filename").notNull(),
  optimizedResume: text("optimized_resume"),
  coverLetter: text("cover_letter"),
  originalAtsScore: integer("original_ats_score"),
  optimizedAtsScore: integer("optimized_ats_score"),
  matchedKeywords: json("matched_keywords").$type<string[]>(),
  missingKeywords: json("missing_keywords").$type<string[]>(),
  recommendations: json("recommendations").$type<Array<{
    type: string;
    title: string;
    description: string;
  }>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertJobApplicationSchema = createInsertSchema(jobApplications).omit({
  id: true,
  createdAt: true,
});

export const jobDetailsSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  roleTitle: z.string().min(1, "Role title is required"),
  jobDescription: z.string().min(50, "Job description must be at least 50 characters"),
});

export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
export type JobApplication = typeof jobApplications.$inferSelect;
export type JobDetails = z.infer<typeof jobDetailsSchema>;

export interface ATSAnalysis {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: Array<{
    type: string;
    title: string;
    description: string;
  }>;
}

export interface OptimizationResult {
  optimizedResume: string;
  coverLetter: string;
  originalAnalysis: ATSAnalysis;
  optimizedAnalysis: ATSAnalysis;
}
