import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { FileUpload } from "@/components/FileUpload";
import { JobDetailsForm } from "@/components/JobDetailsForm";
import { ATSResults } from "@/components/ATSResults";
import { KeywordAnalysis } from "@/components/KeywordAnalysis";
import { Recommendations } from "@/components/Recommendations";
import { DocumentPreview } from "@/components/DocumentPreview";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Briefcase } from "lucide-react";
import type { JobDetails, OptimizationResult } from "@shared/schema";

type Step = 1 | 2 | 3;

export function Home() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult | null>(null);
  const { toast } = useToast();

  // File upload mutation
  const uploadMutation = useMutation({
    mutationFn: async ({ file, jobDetails }: { file: File; jobDetails: JobDetails }) => {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDetails', JSON.stringify(jobDetails));

      const response = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setApplicationId(data.applicationId);
      setCurrentStep(2);
      toast({
        title: "Resume uploaded successfully",
        description: "Now generating your optimized resume and cover letter...",
      });
      // Automatically start optimization
      optimizeMutation.mutate(data.applicationId);
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Optimization mutation
  const optimizeMutation = useMutation({
    mutationFn: async (appId: string) => {
      const response = await apiRequest('POST', `/api/optimize/${appId}`);
      return response.json();
    },
    onSuccess: (data: OptimizationResult) => {
      setOptimizationResults(data);
      setCurrentStep(3);
      toast({
        title: "Optimization complete!",
        description: "Your resume and cover letter have been optimized with AI.",
      });
    },
    onError: (error) => {
      toast({
        title: "Optimization failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleJobDetailsSubmit = (jobDetails: JobDetails) => {
    if (!selectedFile) {
      toast({
        title: "No resume uploaded",
        description: "Please upload your resume first.",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate({ file: selectedFile, jobDetails });
  };

  const isLoading = uploadMutation.isPending || optimizeMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary-700 flex items-center">
                  <Briefcase className="mr-2 text-primary-500" />
                  JobMatch Pro
                </h1>
              </div>
              <nav className="hidden md:ml-10 md:flex space-x-8">
                <a href="#" className="text-primary-600 hover:text-primary-700 px-3 py-2 text-sm font-medium">
                  Optimize Resume
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                  Cover Letters
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                  ATS Scanner
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProgressIndicator currentStep={currentStep} />

        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <FileUpload
              onFileSelect={setSelectedFile}
              selectedFile={selectedFile}
              isUploading={isLoading}
              error={uploadMutation.error?.message || null}
            />
            <div className="lg:col-span-1">
              <JobDetailsForm
                onSubmit={handleJobDetailsSubmit}
                isSubmitting={isLoading}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Optimizing Your Resume
            </h2>
            <p className="text-gray-600">
              Our AI is analyzing your resume and generating an optimized version...
            </p>
          </div>
        )}

        {currentStep === 3 && optimizationResults && (
          <div className="space-y-8">
            <ATSResults results={optimizationResults} />
            <KeywordAnalysis results={optimizationResults} />
            <Recommendations results={optimizationResults} />
            <DocumentPreview results={optimizationResults} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <h3 className="text-lg font-bold text-gray-900">JobMatch Pro</h3>
              <span className="ml-2 text-sm text-gray-500">• Optimize your career success</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
