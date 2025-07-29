import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/FileUpload";
import { Header } from "@/components/Header";
import { Search, Target, TrendingUp, AlertTriangle, CheckCircle, Key } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import type { ATSAnalysis } from "@shared/schema";

const atsSchema = z.object({
  jobDescription: z.string().min(50, "Job description must be at least 50 characters"),
});

type ATSData = z.infer<typeof atsSchema>;

interface ATSResultsProps {
  results: ATSAnalysis;
}

function ATSResults({ results }: ATSResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success-600";
    if (score >= 60) return "text-warning-600";
    return "text-red-500";
  };

  const getScoreStroke = (score: number) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    return "Needs Improvement";
  };

  const CircularProgress = ({ score, color }: { score: number; color: string }) => {
    const circumference = 2 * Math.PI * 56;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-3xl font-bold text-gray-900">
          {score}%
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* ATS Score */}
      <Card className="bg-white shadow-sm border border-gray-200 p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          ATS Compatibility Score
        </h3>
        
        <div className="text-center">
          <CircularProgress 
            score={results.score} 
            color={getScoreStroke(results.score)}
          />
          <p className={`text-lg mt-4 font-semibold ${getScoreColor(results.score)}`}>
            {getScoreLabel(results.score)}
          </p>
        </div>
      </Card>

      {/* Keyword Analysis */}
      <Card className="bg-white shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Key className="text-primary-500 mr-2" />
          Keyword Analysis
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Matched Keywords */}
          <div>
            <h4 className="font-medium text-success-700 mb-3 flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              Matched Keywords ({results.matchedKeywords.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {results.matchedKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-success-100 text-success-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
            {results.matchedKeywords.length === 0 && (
              <p className="text-gray-500 text-sm italic">No matched keywords found</p>
            )}
          </div>
          
          {/* Missing Keywords */}
          <div>
            <h4 className="font-medium text-red-700 mb-3 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Missing Keywords ({results.missingKeywords.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {results.missingKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
            {results.missingKeywords.length === 0 && (
              <p className="text-gray-500 text-sm italic">All keywords matched!</p>
            )}
          </div>
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="bg-white shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="text-primary-500 mr-2" />
          Improvement Recommendations
        </h3>
        
        <div className="space-y-4">
          {results.recommendations.map((rec, index) => (
            <div
              key={index}
              className="border-l-4 border-primary-500 bg-primary-50 p-4 rounded-r-lg"
            >
              <h4 className="font-medium text-primary-900">
                {rec.title}
              </h4>
              <p className="text-sm mt-1 text-primary-700">
                {rec.description}
              </p>
            </div>
          ))}
          
          {results.recommendations.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="text-success-500 h-12 w-12 mx-auto mb-4" />
              <p className="text-gray-500">Your resume looks great! No additional recommendations.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export function ATSScanner() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scanResults, setScanResults] = useState<ATSAnalysis | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ATSData>({
    resolver: zodResolver(atsSchema),
    defaultValues: {
      jobDescription: "",
    }
  });

  // Upload and scan mutation
  const scanMutation = useMutation({
    mutationFn: async ({ file, jobDescription }: { file: File; jobDescription: string }) => {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDescription);

      const response = await fetch('/api/scan-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Scan failed');
      }

      return response.json();
    },
    onSuccess: (data: ATSAnalysis) => {
      setScanResults(data);
      toast({
        title: "ATS scan complete!",
        description: "Your resume has been analyzed for ATS compatibility.",
      });
    },
    onError: (error) => {
      toast({
        title: "Scan failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleScan = (data: ATSData) => {
    if (!selectedFile) {
      toast({
        title: "No resume uploaded",
        description: "Please upload your resume first.",
        variant: "destructive",
      });
      return;
    }

    scanMutation.mutate({ file: selectedFile, jobDescription: data.jobDescription });
  };

  const jobDescription = watch("jobDescription");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ATS Resume Scanner
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Analyze how well your resume matches job requirements and get actionable insights to improve your ATS compatibility score.
          </p>
        </div>

        {!scanResults ? (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* File Upload */}
              <FileUpload
                onFileSelect={setSelectedFile}
                selectedFile={selectedFile}
                isUploading={scanMutation.isPending}
                error={null}
              />

              {/* Job Description */}
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Target className="text-primary-500 text-xl mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Job Description</h2>
                  </div>
                  
                  <div>
                    <Label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
                      Paste the job description you want to analyze against
                    </Label>
                    <Textarea
                      id="jobDescription"
                      placeholder="Paste the complete job description here..."
                      rows={12}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200 resize-none"
                      {...register("jobDescription")}
                      disabled={scanMutation.isPending}
                    />
                    {errors.jobDescription && (
                      <p className="text-sm text-red-600 mt-1">{errors.jobDescription.message}</p>
                    )}
                    
                    <div className="mt-3 text-sm text-gray-500">
                      Characters: {jobDescription?.length || 0}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Scan Button */}
            <div className="text-center">
              <Button
                onClick={handleSubmit(handleScan)}
                disabled={scanMutation.isPending || !selectedFile}
                className="bg-primary-600 hover:bg-primary-700 text-white px-12 py-4 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg"
              >
                {scanMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Scanning Resume...
                  </>
                ) : (
                  <>
                    <Search className="w-6 h-6 mr-3" />
                    Analyze Resume with ATS
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 text-center">
              <Button
                onClick={() => {
                  setScanResults(null);
                  setSelectedFile(null);
                }}
                variant="outline"
                className="mr-4"
              >
                Scan Another Resume
              </Button>
            </div>
            
            <ATSResults results={scanResults} />
          </div>
        )}
      </div>
      </div>
    </div>
  );
}