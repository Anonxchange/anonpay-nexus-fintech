
import { supabase } from "@/integrations/supabase/client";

// Get user activity data and status
export const getUserActivity = async (userId: string) => {
  try {
    if (!userId) return null;
    
    // Get user transactions
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);
    
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error getting user profile:', profileError);
    }
    
    // Get user KYC status
    const { data: kycRequests, error: kycError } = await supabase
      .from('kyc_requests')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false })
      .limit(1);
    
    // Aggregated activity data
    const activityData = {
      transactions: transactionsError ? [] : transactions,
      profile: profileError ? null : profile,
      kycStatus: profile?.kyc_status || 'not_submitted',
      kycRequest: kycRequests && kycRequests.length > 0 ? kycRequests[0] : null,
    };
    
    return activityData;
  } catch (error) {
    console.error('Error fetching user activity:', error);
    return null;
  }
};

// Get user KYC submissions
export const getUserKycSubmissions = async (userId: string) => {
  try {
    // Use kyc_requests instead of kyc_submissions
    const { data, error } = await supabase
      .from('kyc_requests')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching KYC submissions:', error);
    return [];
  }
};

// Get user notifications
export const getUserNotifications = async (userId: string) => {
  try {
    // Since we don't have a notifications table, we'll return empty for now
    // In a real implementation, we would query the notifications table
    return [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};
