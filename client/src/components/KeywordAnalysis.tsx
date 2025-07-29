import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Search } from "lucide-react";
import type { OptimizationResult } from "@shared/schema";

interface KeywordAnalysisProps {
  results: OptimizationResult;
}

export function KeywordAnalysis({ results }: KeywordAnalysisProps) {
  return (
    <Card className="bg-white shadow-sm border border-gray-200 p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <Search className="text-primary-500 mr-2" />
        Keyword Analysis
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matched Keywords */}
        <div>
          <h4 className="font-medium text-success-700 mb-3 flex items-center">
            <CheckCircle className="mr-2 h-5 w-5" />
            Matched Keywords ({results.optimizedAnalysis.matchedKeywords.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {results.optimizedAnalysis.matchedKeywords.map((keyword, index) => (
              <span
                key={index}
                className="bg-success-100 text-success-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {keyword}
              </span>
            ))}
          </div>
          {results.optimizedAnalysis.matchedKeywords.length === 0 && (
            <p className="text-gray-500 text-sm italic">No matched keywords found</p>
          )}
        </div>
        
        {/* Missing Keywords */}
        <div>
          <h4 className="font-medium text-red-700 mb-3 flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            Missing Keywords ({results.optimizedAnalysis.missingKeywords.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {results.optimizedAnalysis.missingKeywords.map((keyword, index) => (
              <span
                key={index}
                className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {keyword}
              </span>
            ))}
          </div>
          {results.optimizedAnalysis.missingKeywords.length === 0 && (
            <p className="text-gray-500 text-sm italic">All keywords matched!</p>
          )}
        </div>
      </div>
    </Card>
  );
}
