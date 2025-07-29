import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { FileText, Building, User, Download, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const coverLetterSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  roleTitle: z.string().min(1, "Role title is required"),
  jobDescription: z.string().min(50, "Job description must be at least 50 characters"),
  candidateName: z.string().min(1, "Your name is required"),
  candidateEmail: z.string().email("Valid email is required"),
  candidatePhone: z.string().min(1, "Phone number is required"),
  experience: z.string().min(20, "Please describe your relevant experience"),
});

type CoverLetterData = z.infer<typeof coverLetterSchema>;

export function CoverLetters() {
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<CoverLetterData>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      companyName: "",
      roleTitle: "",
      jobDescription: "",
      candidateName: "",
      candidateEmail: "",
      candidatePhone: "",
      experience: "",
    }
  });

  const generateMutation = useMutation({
    mutationFn: async (data: CoverLetterData) => {
      const response = await apiRequest('POST', '/api/generate-cover-letter', data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedLetter(data.coverLetter);
      toast({
        title: "Cover letter generated!",
        description: "Your personalized cover letter is ready to download.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const downloadLetter = () => {
    if (!generatedLetter) return;
    
    const blob = new Blob([generatedLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cover_letter.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const jobDescription = watch("jobDescription");
  const experience = watch("experience");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Cover Letter Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create personalized, professional cover letters that highlight your experience and match job requirements perfectly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            {/* Personal Information */}
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <User className="text-primary-500 text-xl mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="candidateName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </Label>
                    <Input
                      id="candidateName"
                      placeholder="e.g., John Smith"
                      {...register("candidateName")}
                      disabled={generateMutation.isPending}
                    />
                    {errors.candidateName && (
                      <p className="text-sm text-red-600 mt-1">{errors.candidateName.message}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="candidateEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </Label>
                      <Input
                        id="candidateEmail"
                        type="email"
                        placeholder="john.smith@email.com"
                        {...register("candidateEmail")}
                        disabled={generateMutation.isPending}
                      />
                      {errors.candidateEmail && (
                        <p className="text-sm text-red-600 mt-1">{errors.candidateEmail.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="candidatePhone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </Label>
                      <Input
                        id="candidatePhone"
                        placeholder="(555) 123-4567"
                        {...register("candidatePhone")}
                        disabled={generateMutation.isPending}
                      />
                      {errors.candidatePhone && (
                        <p className="text-sm text-red-600 mt-1">{errors.candidatePhone.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Information */}
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Building className="text-primary-500 text-xl mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Job Information</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </Label>
                      <Input
                        id="companyName"
                        placeholder="e.g., Google, Microsoft"
                        {...register("companyName")}
                        disabled={generateMutation.isPending}
                      />
                      {errors.companyName && (
                        <p className="text-sm text-red-600 mt-1">{errors.companyName.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="roleTitle" className="block text-sm font-medium text-gray-700 mb-2">
                        Role Title
                      </Label>
                      <Input
                        id="roleTitle"
                        placeholder="e.g., Senior Software Engineer"
                        {...register("roleTitle")}
                        disabled={generateMutation.isPending}
                      />
                      {errors.roleTitle && (
                        <p className="text-sm text-red-600 mt-1">{errors.roleTitle.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
                      Job Description
                    </Label>
                    <Textarea
                      id="jobDescription"
                      placeholder="Paste the complete job description here..."
                      rows={6}
                      {...register("jobDescription")}
                      disabled={generateMutation.isPending}
                    />
                    {errors.jobDescription && (
                      <p className="text-sm text-red-600 mt-1">{errors.jobDescription.message}</p>
                    )}
                    <div className="mt-2 text-sm text-gray-500">
                      Characters: {jobDescription?.length || 0}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <FileText className="text-primary-500 text-xl mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Your Experience</h2>
                </div>
                
                <div>
                  <Label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                    Relevant Experience & Skills
                  </Label>
                  <Textarea
                    id="experience"
                    placeholder="Describe your relevant work experience, key achievements, and skills that match this role..."
                    rows={6}
                    {...register("experience")}
                    disabled={generateMutation.isPending}
                  />
                  {errors.experience && (
                    <p className="text-sm text-red-600 mt-1">{errors.experience.message}</p>
                  )}
                  <div className="mt-2 text-sm text-gray-500">
                    Characters: {experience?.length || 0}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleSubmit((data) => generateMutation.mutate(data))}
              disabled={generateMutation.isPending}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 text-lg font-semibold"
            >
              {generateMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Cover Letter...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate AI Cover Letter
                </>
              )}
            </Button>
          </div>

          {/* Generated Cover Letter */}
          <div>
            <Card className="bg-white shadow-sm border border-gray-200 sticky top-8">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Generated Cover Letter
                  </h3>
                  {generatedLetter && (
                    <Button
                      onClick={downloadLetter}
                      className="bg-primary-600 hover:bg-primary-700 text-white"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
              <CardContent className="p-6">
                {generatedLetter ? (
                  <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-sm">
                      {generatedLetter}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Fill out the form and click "Generate AI Cover Letter" to create your personalized cover letter.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}