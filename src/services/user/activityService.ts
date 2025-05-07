
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
    
    // Instead of checking tables directly (which causes TypeScript errors),
    // we'll try to fetch KYC submissions and handle errors gracefully
    try {
      // Use RPC (stored procedure) if available, or fallback to empty array
      const { data, error } = await supabase
        .rpc('get_kyc_submissions', { user_id_param: userId })
        .catch(() => ({ data: null, error: new Error('RPC not available') }));
      
      if (!error && data && Array.isArray(data)) {
        kycSubmissions.push(...data);
      } else {
        console.log('Note: KYC submissions table or function might not exist yet');
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
