import { type JobApplication, type InsertJobApplication } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createJobApplication(application: InsertJobApplication): Promise<JobApplication>;
  getJobApplication(id: string): Promise<JobApplication | undefined>;
  updateJobApplication(id: string, updates: Partial<JobApplication>): Promise<JobApplication | undefined>;
  deleteJobApplication(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private applications: Map<string, JobApplication>;

  constructor() {
    this.applications = new Map();
  }

  async createJobApplication(insertApplication: InsertJobApplication): Promise<JobApplication> {
    const id = randomUUID();
    const application: JobApplication = {
      ...insertApplication,
      optimizedResume: insertApplication.optimizedResume ?? null,
      coverLetter: insertApplication.coverLetter ?? null,
      originalAtsScore: insertApplication.originalAtsScore ?? null,
      optimizedAtsScore: insertApplication.optimizedAtsScore ?? null,
      matchedKeywords: (insertApplication.matchedKeywords as string[] | null) ?? null,
      missingKeywords: (insertApplication.missingKeywords as string[] | null) ?? null,
      recommendations: (insertApplication.recommendations as Array<{
        type: string;
        title: string;
        description: string;
      }> | null) ?? null,
      id,
      createdAt: new Date(),
    };
    this.applications.set(id, application);
    return application;
  }

  async getJobApplication(id: string): Promise<JobApplication | undefined> {
    return this.applications.get(id);
  }

  async updateJobApplication(id: string, updates: Partial<JobApplication>): Promise<JobApplication | undefined> {
    const existing = this.applications.get(id);
    if (!existing) {
      return undefined;
    }
    
    const updated: JobApplication = {
      ...existing,
      ...updates,
    };
    
    this.applications.set(id, updated);
    return updated;
  }

  async deleteJobApplication(id: string): Promise<boolean> {
    return this.applications.delete(id);
  }
}

export const storage = new MemStorage();
