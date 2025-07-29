import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, Key, Target } from "lucide-react";
import type { OptimizationResult } from "@shared/schema";

interface ATSResultsProps {
  results: OptimizationResult;
}

export function ATSResults({ results }: ATSResultsProps) {
  const improvement = results.optimizedAnalysis.score - results.originalAnalysis.score;
  const matchedKeywords = results.optimizedAnalysis.matchedKeywords.length;
  const totalKeywords = matchedKeywords + results.optimizedAnalysis.missingKeywords.length;
  const skillAlignment = Math.round((matchedKeywords / totalKeywords) * 100);

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
    <Card className="bg-white shadow-sm border border-gray-200 p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        ATS Analysis Results
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Original Resume Score */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Original Resume
          </h3>
          <CircularProgress 
            score={results.originalAnalysis.score} 
            color={getScoreStroke(results.originalAnalysis.score)}
          />
          <p className={`text-sm mt-2 ${getScoreColor(results.originalAnalysis.score)}`}>
            {getScoreLabel(results.originalAnalysis.score)}
          </p>
        </div>
        
        {/* Optimized Resume Score */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Optimized Resume
          </h3>
          <CircularProgress 
            score={results.optimizedAnalysis.score} 
            color={getScoreStroke(results.optimizedAnalysis.score)}
          />
          <p className={`text-sm mt-2 ${getScoreColor(results.optimizedAnalysis.score)}`}>
            {getScoreLabel(results.optimizedAnalysis.score)}
          </p>
        </div>
      </div>
      
      {/* Improvement Metrics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-success-50 rounded-lg p-4 text-center">
          <ArrowUp className="text-success-600 text-2xl mb-2 mx-auto" />
          <p className="text-2xl font-bold text-success-700">
            +{improvement}%
          </p>
          <p className="text-sm text-success-600">Score Improvement</p>
        </div>
        
        <div className="bg-primary-50 rounded-lg p-4 text-center">
          <Key className="text-primary-600 text-2xl mb-2 mx-auto" />
          <p className="text-2xl font-bold text-primary-700">
            {matchedKeywords}/{totalKeywords}
          </p>
          <p className="text-sm text-primary-600">Keywords Matched</p>
        </div>
        
        <div className="bg-warning-50 rounded-lg p-4 text-center">
          <Target className="text-warning-600 text-2xl mb-2 mx-auto" />
          <p className="text-2xl font-bold text-warning-700">
            {skillAlignment}%
          </p>
          <p className="text-sm text-warning-600">Skill Alignment</p>
        </div>
      </div>
    </Card>
  );
}
