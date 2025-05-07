
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
    
    // Since the check_table_exists and get_kyc_submissions_for_user functions 
    // are not available in the database, we'll use a direct query approach
    
    try {
      // Check if kyc_submissions table exists using metadata query
      const { data: tables, error: metadataError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'kyc_submissions')
        .eq('table_schema', 'public');
      
      if (metadataError) {
        console.error('Error checking if table exists:', metadataError);
      }
      
      // Only try to fetch KYC submissions if the table exists
      if (tables && tables.length > 0) {
        // Fetch KYC submissions directly
        const { data: kycData, error: kycError } = await supabase
          .from('kyc_submissions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
          
        if (!kycError && kycData && Array.isArray(kycData)) {
          kycSubmissions.push(...kycData);
        }
      }
    } catch (error) {
      console.log('Error fetching KYC submissions:', error);
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
