
import { supabase } from "@/integrations/supabase/client";

// Get user activity log
export const getUserActivityLog = async (adminId: string, userId: string): Promise<any[]> => {
  try {
    // First check if the user is an admin using the is_admin function
    const { data: isAdmin, error: adminError } = await supabase
      .rpc('is_admin', { user_id: adminId });

    if (adminError || !isAdmin) {
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
    
    // Check if the table exists first using our new RPC function
    const { data: tableExists, error: checkError } = await supabase
      .rpc('check_table_exists', { table_name: 'kyc_submissions' });
    
    if (checkError) {
      console.error('Error checking if table exists:', checkError);
    }
    
    // Only try to fetch KYC submissions if the table exists
    if (tableExists) {
      try {
        // Use our new RPC function to fetch KYC submissions
        const { data, error } = await supabase
          .rpc('get_kyc_submissions_for_user', { user_id_param: userId });
          
        if (!error && data && Array.isArray(data)) {
          kycSubmissions.push(...data);
        }
      } catch (error) {
        console.log('Error fetching KYC submissions:', error);
        // We'll continue without KYC data
      }
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
