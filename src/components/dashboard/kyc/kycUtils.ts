
import { supabase } from "@/integrations/supabase/client";
import { KycSubmission } from "@/types/kyc";

/**
 * Fetches the latest KYC submission for a user
 */
export const fetchKycSubmission = async (userId: string): Promise<KycSubmission | null> => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('kyc_submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error || !data) {
      console.error("Error fetching KYC submission:", error);
      return null;
    }
    
    // Convert database record to KycSubmission type with fallbacks for missing fields
    const submission: KycSubmission = {
      id: data.id,
      user_id: data.user_id,
      full_name: data.full_name || "Not provided",
      date_of_birth: data.date_of_birth || "Not provided",
      address: data.address || "Not provided",
      id_number: data.id_number || "Not provided", 
      id_type: data.id_type || data.document_type || "Not provided",
      phone: data.phone || "Not provided",
      document_url: data.document_url || "",
      selfie_url: data.selfie_url || "Not provided",
      status: data.status as "pending" | "approved" | "rejected",
      admin_notes: data.admin_notes,
      created_at: data.created_at,
      updated_at: data.updated_at,
      document_type: data.document_type,
    };
    
    return submission;
  } catch (error) {
    console.error("Error in fetchKycSubmission:", error);
    return null;
  }
};
