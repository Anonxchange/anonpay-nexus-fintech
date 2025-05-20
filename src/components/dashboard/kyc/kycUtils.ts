
import { supabase } from "@/integrations/supabase/client";
import { KycSubmission } from "@/types/kyc";

/**
 * Fetches the latest KYC submission for a user
 */
export const fetchKycSubmission = async (userId: string): Promise<KycSubmission | null> => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('kyc_requests')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error || !data) {
      console.error("Error fetching KYC submission:", error);
      return null;
    }
    
    // Convert database record to KycSubmission type with fallbacks for missing fields
    const submission: KycSubmission = {
      id: data.id,
      user_id: data.user_id || "",
      full_name: data.full_name || "Not provided",
      date_of_birth: "Not provided", // Not in kyc_requests table
      address: "Not provided", // Not in kyc_requests table
      id_number: data.id_number || "Not provided",
      id_type: data.id_type || "Not provided",
      phone: "Not provided", // Not in kyc_requests table
      document_url: data.id_image_url || "",
      selfie_url: "Not provided", // Not in kyc_requests table
      status: data.status as "pending" | "approved" | "rejected",
      admin_notes: "Not provided", // Not in kyc_requests table
      created_at: data.submitted_at,
      updated_at: data.submitted_at,
      document_type: data.id_type // Use id_type as document_type
    };
    
    return submission;
  } catch (error) {
    console.error("Error in fetchKycSubmission:", error);
    return null;
  }
};
