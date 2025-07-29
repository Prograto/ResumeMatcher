import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  isUploading: boolean;
  error: string | null;
}

export function FileUpload({ onFileSelect, selectedFile, isUploading, error }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      return;
    }
    
    onFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const clearFile = () => {
    onFileSelect(null as any);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Upload className="text-primary-500 text-xl mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Upload Resume</h2>
        </div>
        
        {!selectedFile ? (
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition duration-200",
              isDragOver
                ? "border-primary-500 bg-primary-50"
                : "border-gray-300 hover:border-primary-400",
              isUploading && "opacity-50 cursor-not-allowed"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={!isUploading ? handleBrowseClick : undefined}
          >
            <Upload className="text-4xl text-gray-400 mb-4 mx-auto" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              {isUploading ? "Processing..." : "Drag & drop your resume"}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {isUploading ? "Please wait..." : "or click to browse files"}
            </p>
            <p className="text-xs text-gray-400">Supports PDF, DOCX (Max 10MB)</p>
            
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.docx"
              onChange={handleInputChange}
              disabled={isUploading}
            />
            
            {!isUploading && (
              <Button 
                className="mt-4 bg-primary-600 hover:bg-primary-700 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBrowseClick();
                }}
              >
                Browse Files
              </Button>
            )}
          </div>
        ) : (
          <div className="p-3 bg-success-50 rounded-lg border border-success-200">
            <div className="flex items-center">
              <FileText className="text-red-500 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(1)} MB • Ready to process
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-success-500" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFile}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
