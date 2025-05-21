
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { KycFormData } from "@/types/kyc";

export const useKycFormSubmission = (onComplete: () => void) => {
  const [uploading, setUploading] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDocumentFile(e.target.files[0]);
    }
  };

  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelfieFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: KycFormData) => {
    if (!documentFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload your ID document",
      });
      return;
    }

    if (!selfieFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload your selfie",
      });
      return;
    }

    setUploading(true);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // First, upload the document file
      const documentFileName = `${user.id}_${Date.now()}_document.${
        documentFile.name.split(".").pop()
      }`;
      const { data: documentData, error: documentError } = await supabase.storage
        .from("kyc_documents")
        .upload(documentFileName, documentFile);

      if (documentError) {
        throw new Error(`Document upload failed: ${documentError.message}`);
      }

      // Get the document URL
      const {
        data: { publicUrl: documentUrl },
      } = supabase.storage.from("kyc_documents").getPublicUrl(documentFileName);

      // Then, upload the selfie file
      const selfieFileName = `${user.id}_${Date.now()}_selfie.${
        selfieFile.name.split(".").pop()
      }`;
      const { data: selfieData, error: selfieError } = await supabase.storage
        .from("kyc_documents")
        .upload(selfieFileName, selfieFile);

      if (selfieError) {
        throw new Error(`Selfie upload failed: ${selfieError.message}`);
      }

      // Get the selfie URL
      const {
        data: { publicUrl: selfieUrl },
      } = supabase.storage.from("kyc_documents").getPublicUrl(selfieFileName);

      // Submit KYC data to database
      const { error: submissionError } = await supabase
        .from("kyc_requests")
        .insert({
          user_id: user.id,
          full_name: data.full_name,
          id_type: data.id_type,
          id_number: data.id_number,
          id_image_url: documentUrl,
          status: "pending"
        });

      if (submissionError) {
        throw new Error(`KYC submission failed: ${submissionError.message}`);
      }

      // Update user profile status
      const { error: profileError } = await supabase
        .from("user_profiles")
        .update({ kyc_status: "pending" })
        .eq("user_id", user.id);

      if (profileError) {
        throw new Error(`Profile update failed: ${profileError.message}`);
      }

      toast({
        title: "KYC Submitted",
        description:
          "Your verification documents have been submitted successfully.",
      });

      onComplete();
    } catch (error: any) {
      console.error("KYC submission error:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "Failed to submit KYC. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    documentFile,
    selfieFile,
    handleDocumentChange,
    handleSelfieChange,
    onSubmit
  };
};
