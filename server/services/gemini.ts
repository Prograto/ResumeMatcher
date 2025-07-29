import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || "" 
});

export interface ATSAnalysisResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: Array<{
    type: string;
    title: string;
    description: string;
  }>;
}

export async function analyzeResumeATS(resumeText: string, jobDescription: string): Promise<ATSAnalysisResult> {
  try {
    const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyzer. Analyze the resume against the job description and provide:
1. An ATS compatibility score (0-100)
2. Keywords from job description that are matched in the resume
3. Important keywords missing from the resume
4. Specific actionable recommendations

Respond with JSON in this exact format:
{
  "score": number,
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "recommendations": [
    {
      "type": "add|improve|enhance",
      "title": "Brief title",
      "description": "Detailed recommendation"
    }
  ]
}`;

    const prompt = `Job Description:\n${jobDescription}\n\nResume:\n${resumeText}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            score: { type: "number" },
            matchedKeywords: { 
              type: "array",
              items: { type: "string" }
            },
            missingKeywords: { 
              type: "array",
              items: { type: "string" }
            },
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" }
                },
                required: ["type", "title", "description"]
              }
            }
          },
          required: ["score", "matchedKeywords", "missingKeywords", "recommendations"]
        }
      },
      contents: prompt,
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from Gemini API");
    }

    return JSON.parse(rawJson);
  } catch (error) {
    console.error("ATS analysis error:", error);
    throw new Error(`Failed to analyze resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function optimizeResume(
  originalResumeText: string, 
  jobDescription: string, 
  companyName: string, 
  roleTitle: string
): Promise<string> {
  try {
    const systemPrompt = `You are an expert resume optimization specialist. Create an optimized version of the provided resume that:
1. Strategically incorporates relevant keywords from the job description
2. Highlights relevant experience and skills
3. Uses action verbs and quantifiable achievements
4. Maintains professional formatting and structure
5. Maximizes ATS compatibility

Return only the complete optimized resume text in a professional format.`;

    const prompt = `Company: ${companyName}
Role: ${roleTitle}

Job Description:
${jobDescription}

Original Resume:
${originalResumeText}

Please optimize this resume for the above position.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      config: {
        systemInstruction: systemPrompt
      }
    });

    const optimizedResume = response.text;
    if (!optimizedResume) {
      throw new Error("Empty response from Gemini API");
    }

    return optimizedResume;
  } catch (error) {
    console.error("Resume optimization error:", error);
    throw new Error(`Failed to optimize resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateCoverLetter(
  resumeText: string,
  jobDescription: string,
  companyName: string,
  roleTitle: string
): Promise<string> {
  try {
    const systemPrompt = `You are an expert cover letter writer. Create a personalized, professional cover letter that:
1. Shows genuine interest in the company and role
2. Connects the candidate's experience to job requirements
3. Highlights relevant achievements from the resume
4. Maintains a professional yet engaging tone
5. Follows proper business letter format

Return only the complete cover letter text.`;

    const prompt = `Company: ${companyName}
Role: ${roleTitle}

Job Description:
${jobDescription}

Candidate's Resume:
${resumeText}

Please write a compelling cover letter for this application.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      config: {
        systemInstruction: systemPrompt
      }
    });

    const coverLetter = response.text;
    if (!coverLetter) {
      throw new Error("Empty response from Gemini API");
    }

    return coverLetter;
  } catch (error) {
    console.error("Cover letter generation error:", error);
    throw new Error(`Failed to generate cover letter: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
