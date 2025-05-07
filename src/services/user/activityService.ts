
import { supabase } from "@/integrations/supabase/client";

// Get user activity log
export const getUserActivityLog = async (adminId: string, userId: string): Promise<any[]> => {
  try {
    // First check if the user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', adminId)
      .single();

    // Safe access to role property
    const role = adminData?.role || 'user';

    if (adminError || role !== 'admin') {
      console.error('Error: Not authorized as admin', adminError);
      return [];
    }
    
    // Get all transactions for the user
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (transactionsError) {
      console.error('Error fetching user transactions:', transactionsError);
      return [];
    }
    
    // For KYC submissions, we'll handle them separately
    // We'll create a properly structured empty array for consistency
    const kycSubmissions: any[] = [];
    
    // Instead of using RPC, which doesn't exist yet, we'll use a safe approach
    // In the future, you could create the RPC function in Supabase
    try {
      // For now, we'll just log that KYC submissions functionality is not available
      console.log('Note: KYC submissions functionality not fully implemented yet');
      
      // In the future, you could implement this by:
      // 1. Creating a kyc_submissions table in Supabase
      // 2. Adding it to the Database types in supabase/types.ts
      // 3. Then querying it directly with:
      /*
      const { data: kycData, error: kycError } = await supabase
        .from('kyc_submissions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (!kycError && kycData) {
        kycSubmissions.push(...kycData);
      }
      */
      
    } catch (error) {
      console.log('Error handling KYC submissions:', error);
      // We'll continue without KYC data
    }
    
    // Combine all activities with a type marker
    const allActivities = [
      ...(transactions || []).map(t => ({ ...t, activity_type: 'transaction' })),
      ...(kycSubmissions || []).map(k => ({ ...k, activity_type: 'kyc_submission' }))
    ];
    
    // Sort by created_at date
    return allActivities.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    console.error('Error in getUserActivityLog:', error);
    return [];
  }
};
