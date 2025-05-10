
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, FileCheck, X } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  fileUrl?: string | null;
  acceptedFileTypes?: string;
  maxSize?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  isUploading = false,
  fileUrl = null,
  acceptedFileTypes = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
}) => {
  const [error, setError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    // Validate file type
    if (!file.type.match(acceptedFileTypes.replace(/,\s*/g, "|").replace(/\*/g, ".*"))) {
      setError(`Invalid file type. Please upload ${acceptedFileTypes}`);
      return;
    }
    
    // Validate file size
    if (file.size > maxSize) {
      setError(`File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
      return;
    }
    
    setError(null);
    setSelectedFileName(file.name);
    onFileSelect(file);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearFile = () => {
    setSelectedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isImage = fileUrl && (fileUrl.endsWith('.jpg') || fileUrl.endsWith('.jpeg') || fileUrl.endsWith('.png'));
  const isPdf = fileUrl && fileUrl.endsWith('.pdf');

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedFileTypes}
        className="hidden"
        disabled={isUploading}
      />
      
      {!fileUrl ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-lg bg-gray-50">
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium">Drop file here or</p>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleButtonClick} 
                className="mt-2"
              >
                Select File
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                {acceptedFileTypes.replace('image/', '').replace('application/', '')} (Max. {maxSize / (1024 * 1024)}MB)
              </p>
            </div>
          )}
          
          {selectedFileName && !isUploading && (
            <div className="flex items-center mt-2 bg-gray-100 rounded p-2">
              <FileCheck className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm text-gray-700 truncate max-w-[200px]">
                {selectedFileName}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 ml-2" 
                onClick={clearFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-gray-300">
          {isImage ? (
            <div className="relative">
              <img 
                src={fileUrl} 
                alt="Uploaded file" 
                className="w-full h-32 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                <p className="text-xs text-white truncate">File uploaded</p>
              </div>
            </div>
          ) : isPdf ? (
            <div className="flex items-center justify-center h-32 bg-gray-100">
              <div className="text-center p-4">
                <FileCheck className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">PDF Document</p>
                <p className="text-xs text-gray-500">File uploaded</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 bg-gray-100">
              <div className="text-center p-4">
                <FileCheck className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">File uploaded</p>
              </div>
            </div>
          )}
          <Button 
            variant="secondary" 
            size="sm" 
            className="absolute top-2 right-2" 
            onClick={handleButtonClick}
          >
            Replace
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
