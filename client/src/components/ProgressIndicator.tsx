import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
}

const steps = [
  { number: 1, title: "Upload & Input" },
  { number: 2, title: "Generate & Optimize" },
  { number: 3, title: "Review & Download" },
];

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        <div className="flex items-center w-full max-w-2xl">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              {/* Step Circle and Title */}
              <div className="flex items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium",
                    currentStep >= step.number
                      ? "bg-primary-600 text-white"
                      : "bg-gray-300 text-gray-500"
                  )}
                >
                  {step.number}
                </div>
                <div className="ml-3">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      currentStep >= step.number
                        ? "text-primary-600"
                        : "text-gray-500"
                    )}
                  >
                    {step.title}
                  </p>
                </div>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-gray-300 mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
