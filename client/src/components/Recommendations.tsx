import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Plus, Edit, CheckCircle } from "lucide-react";
import type { OptimizationResult } from "@shared/schema";

interface RecommendationsProps {
  results: OptimizationResult;
}

export function Recommendations({ results }: RecommendationsProps) {
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "add":
        return <Plus className="text-primary-600 mt-1 mr-3 h-5 w-5" />;
      case "improve":
        return <Edit className="text-warning-600 mt-1 mr-3 h-5 w-5" />;
      case "enhance":
        return <CheckCircle className="text-success-600 mt-1 mr-3 h-5 w-5" />;
      default:
        return <Lightbulb className="text-primary-600 mt-1 mr-3 h-5 w-5" />;
    }
  };

  const getRecommendationBorderColor = (type: string) => {
    switch (type) {
      case "add":
        return "border-primary-500 bg-primary-50";
      case "improve":
        return "border-warning-500 bg-warning-50";
      case "enhance":
        return "border-success-500 bg-success-50";
      default:
        return "border-primary-500 bg-primary-50";
    }
  };

  const getRecommendationTextColor = (type: string) => {
    switch (type) {
      case "add":
        return "text-primary-900";
      case "improve":
        return "text-warning-900";
      case "enhance":
        return "text-success-900";
      default:
        return "text-primary-900";
    }
  };

  const getRecommendationDescColor = (type: string) => {
    switch (type) {
      case "add":
        return "text-primary-700";
      case "improve":
        return "text-warning-700";
      case "enhance":
        return "text-success-700";
      default:
        return "text-primary-700";
    }
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200 p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <Lightbulb className="text-warning-500 mr-2" />
        Optimization Recommendations
      </h3>
      
      <div className="space-y-4">
        {results.optimizedAnalysis.recommendations.map((rec, index) => (
          <div
            key={index}
            className={`border-l-4 p-4 rounded-r-lg ${getRecommendationBorderColor(rec.type)}`}
          >
            <div className="flex items-start">
              {getRecommendationIcon(rec.type)}
              <div>
                <h4 className={`font-medium ${getRecommendationTextColor(rec.type)}`}>
                  {rec.title}
                </h4>
                <p className={`text-sm mt-1 ${getRecommendationDescColor(rec.type)}`}>
                  {rec.description}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {results.optimizedAnalysis.recommendations.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="text-success-500 h-12 w-12 mx-auto mb-4" />
            <p className="text-gray-500">Your optimized resume looks great! No additional recommendations.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
