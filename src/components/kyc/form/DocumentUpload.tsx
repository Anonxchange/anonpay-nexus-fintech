
import React from "react";
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface DocumentUploadProps {
  onDocumentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelfieChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ 
  onDocumentChange, 
  onSelfieChange, 
  uploading 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <FormItem>
          <FormLabel>ID Document</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*,application/pdf"
              onChange={onDocumentChange}
              disabled={uploading}
            />
          </FormControl>
          <FormDescription>
            Upload a clear image or PDF of your ID document.
          </FormDescription>
          <FormMessage />
        </FormItem>
      </div>

      <div>
        <FormItem>
          <FormLabel>Selfie</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              onChange={onSelfieChange}
              disabled={uploading}
            />
          </FormControl>
          <FormDescription>
            Upload a selfie of yourself holding your ID document.
          </FormDescription>
          <FormMessage />
        </FormItem>
      </div>
    </div>
  );
};

export default DocumentUpload;
