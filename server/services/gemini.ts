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
    console.log('Gemini ATS raw response:', rawJson);
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
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
    const systemPrompt = `You are an expert resume optimization specialist. Create an optimized version of the provided resume that:
1. Strategically incorporates relevant keywords from the job description
2. Highlights relevant experience and skills with quantifiable achievements
3. Uses strong action verbs and professional language
4. Maintains clean, professional formatting with clear sections
5. Maximizes ATS compatibility with proper keyword density
6. Follows this professional format structure:

[CANDIDATE NAME]
[Contact Information]

PROFESSIONAL SUMMARY
• Compelling 2-3 line summary targeting the specific role

CORE COMPETENCIES
• Key skills organized in a scannable format

PROFESSIONAL EXPERIENCE
[COMPANY NAME] | [DATES]
[Job Title]
• Achievement-focused bullet points with metrics
• Action verbs and relevant keywords
• Quantified results when possible

EDUCATION
[Degree] | [Institution] | [Year]

Return only the complete optimized resume text with professional formatting.`;

    const prompt = `Company: ${companyName}
Role: ${roleTitle}

Job Description:
${jobDescription}

Original Resume:
${originalResumeText}

Please optimize this resume for the above position with professional formatting and clear sections.`;

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
      lastError = error;
      // Retry on 503 (model overloaded)
      if (error && typeof error === 'object' && 'message' in error && String(error.message).includes('503')) {
        if (attempt < 2) {
          await new Promise(res => setTimeout(res, 2000)); // wait 2 seconds
          continue;
        }
        throw new Error('The AI service is overloaded. Please try again in a few minutes.');
      }
      // Other errors: do not retry
      break;
    }
  }
  console.error("Resume optimization error:", lastError);
  throw new Error(`Failed to optimize resume: ${lastError instanceof Error ? lastError.message : 'Unknown error'}`);
}

export async function generateCoverLetter(
  resumeText: string,
  jobDescription: string,
  companyName: string,
  roleTitle: string
): Promise<string> {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
    const systemPrompt = `You are an expert cover letter writer. Create a personalized, professional cover letter that:
1. Shows genuine interest in the company and role
2. Connects the candidate's experience to job requirements
3. Highlights relevant achievements from the resume
4. Maintains a professional yet engaging tone
5. Follows proper business letter format with sections:
   - Header with contact information
   - Date and employer address
   - Professional salutation
   - Opening paragraph expressing interest
   - Body paragraphs connecting experience to role
   - Closing paragraph with call to action
   - Professional sign-off

Return only the complete cover letter text with proper formatting.`;

    const prompt = `Company: ${companyName}
Role: ${roleTitle}

Job Description:
${jobDescription}

Candidate's Resume/Experience:
${resumeText}

Please write a compelling, well-formatted cover letter for this application.`;

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
      lastError = error;
      // Retry on 503 (model overloaded)
      if (error && typeof error === 'object' && 'message' in error && String(error.message).includes('503')) {
        if (attempt < 2) {
          await new Promise(res => setTimeout(res, 2000)); // wait 2 seconds
          continue;
        }
        throw new Error('The AI service is overloaded. Please try again in a few minutes.');
      }
      // Other errors: do not retry
      break;
    }
  }
  console.error("Cover letter generation error:", lastError);
  throw new Error(`Failed to generate cover letter: ${lastError instanceof Error ? lastError.message : 'Unknown error'}`);
}
