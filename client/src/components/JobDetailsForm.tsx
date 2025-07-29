import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Building, ClipboardList, Lightbulb } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobDetailsSchema, type JobDetails } from "@shared/schema";

interface JobDetailsFormProps {
  onSubmit: (data: JobDetails) => void;
  isSubmitting: boolean;
}

export function JobDetailsForm({ onSubmit, isSubmitting }: JobDetailsFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<JobDetails>({
    resolver: zodResolver(jobDetailsSchema),
    defaultValues: {
      companyName: "",
      roleTitle: "",
      jobDescription: "",
    }
  });

  const jobDescription = watch("jobDescription");
  const characterCount = jobDescription?.length || 0;

  return (
    <div className="space-y-8">
      {/* Job Details Card */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Building className="text-primary-500 text-xl mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Job Details</h2>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </Label>
              <Input
                id="companyName"
                placeholder="e.g., Google, Microsoft, Startup Inc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200"
                {...register("companyName")}
                disabled={isSubmitting}
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
                placeholder="e.g., Senior Software Engineer, Product Manager"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200"
                {...register("roleTitle")}
                disabled={isSubmitting}
              />
              {errors.roleTitle && (
                <p className="text-sm text-red-600 mt-1">{errors.roleTitle.message}</p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Job Description Card */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <ClipboardList className="text-primary-500 text-xl mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Job Description</h2>
            </div>
          </div>
          
          <Textarea
            placeholder="Paste the complete job description here..."
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200 resize-none"
            {...register("jobDescription")}
            disabled={isSubmitting}
          />
          {errors.jobDescription && (
            <p className="text-sm text-red-600 mt-1">{errors.jobDescription.message}</p>
          )}
          
          <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
            <span>Characters: {characterCount.toLocaleString()}</span>
            <span className="flex items-center">
              <Lightbulb className="text-warning-500 mr-1 h-4 w-4" />
              Tip: Include the complete job posting for better optimization
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center">
        <div className="flex space-x-4">
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Generate Optimized Resume
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
