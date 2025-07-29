import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { OptimizationResult } from "@shared/schema";

interface DocumentPreviewProps {
  results: OptimizationResult;
}

export function DocumentPreview({ results }: DocumentPreviewProps) {
  const downloadDocument = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDocumentPreview = (content: string, maxLength: number = 1000) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Optimized Resume Preview */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Optimized Resume
            </h3>
            <Button
              onClick={() => downloadDocument(results.optimizedResume, 'optimized_resume.txt')}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto text-sm">
            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
              {formatDocumentPreview(results.optimizedResume)}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Cover Letter Preview */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Cover Letter
            </h3>
            <Button
              onClick={() => downloadDocument(results.coverLetter, 'cover_letter.txt')}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto text-sm">
            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
              {formatDocumentPreview(results.coverLetter)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
