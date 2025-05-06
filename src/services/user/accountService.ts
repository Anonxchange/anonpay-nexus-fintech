
import { supabase } from "@/integrations/supabase/client";

// Update user KYC status
export const updateKycStatus = async (userId: string, status: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ kyc_status: status, updated_at: new Date().toISOString() })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating KYC status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateKycStatus:', error);
    return false;
  }
};

// Update user account status (active, suspended, blocked)
export const updateUserAccountStatus = async (adminId: string, userId: string, status: string): Promise<boolean> => {
  try {
    // First check if the user is an admin using the is_admin function
    const { data: isAdmin, error: adminError } = await supabase
      .rpc('is_admin', { user_id: adminId });

    if (adminError || !isAdmin) {
      console.error('Error: Not authorized as admin', adminError);
      return false;
    }
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        account_status: status,
        updated_at: new Date().toISOString() 
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating user account status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateUserAccountStatus:', error);
    return false;
  }
};
