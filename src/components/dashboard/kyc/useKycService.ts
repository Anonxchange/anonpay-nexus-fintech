
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { KycSubmission } from "@/types/kyc";
import { fetchKycSubmission } from "./kycUtils";
import { supabase } from "@/integrations/supabase/client";

export const useKycService = (user: any) => {
  const { profile, refreshProfile } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [kycSubmission, setKycSubmission] = useState<KycSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  
  const kycStatus = profile?.kyc_status || "not_submitted";
  
  useEffect(() => {
    const loadKycSubmission = async () => {
      if (user?.id) {
        setLoading(true);
        const submission = await fetchKycSubmission(user.id);
        if (submission) {
          setKycSubmission(submission);
        }
        setLoading(false);
      }
    };
    
    loadKycSubmission();
  }, [user]);
  
  const handleCompleteSubmission = async () => {
    setShowForm(false);
    if (refreshProfile) {
      await refreshProfile();
    }
    
    // Fetch the latest KYC submission
    if (user?.id) {
      const submission = await fetchKycSubmission(user.id);
      if (submission) {
        setKycSubmission(submission);
      }
    }
  };
  
  return {
    kycStatus,
    kycSubmission,
    showForm,
    setShowForm,
    loading,
    handleCompleteSubmission
  };
};
