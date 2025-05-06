import { supabase } from "@/integrations/supabase/client";
import { supabaseAdmin } from "@/integrations/supabase/adminClient";
import { Profile, AccountStatus } from "@/types/auth";
import { Transaction } from "../transactions/types";

// Get all profiles for admin view
export const getAllProfiles = async (adminId: string): Promise<Profile[]> => {
  try {
    console.log("Checking if user is admin:", adminId);
    // First check if the user is an admin using the is_admin function
    const { data: isAdmin, error: adminError } = await supabase
      .rpc('is_admin', { user_id: adminId });

    if (adminError) {
      console.error('Error checking admin status:', adminError);
      throw new Error('Not authorized as admin: ' + adminError.message);
    }
    
    if (!isAdmin) {
      console.error('Error: User is not an admin');
      throw new Error('Not authorized as admin');
    }
    
    console.log("Admin status confirmed, fetching all profiles");
    
    // For this version, we'll use the standard client since we need admin client setup
    // First try with supabaseAdmin
    let profiles = null;
    let error = null;
    
    try {
      console.log("Attempting to fetch profiles with supabaseAdmin");
      const result = await supabaseAdmin
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      profiles = result.data;
      error = result.error;
      
      if (error) {
        console.warn('Error using supabaseAdmin, falling back to standard client:', error);
      } else {
        console.log(`Successfully fetched ${profiles?.length || 0} profiles with supabaseAdmin`);
      }
    } catch (adminError) {
      console.warn('Failed to use supabaseAdmin, falling back to standard client:', adminError);
      error = adminError;
    }

    // Fall back to standard client if admin client fails
    if (!profiles || error) {
      console.log("Falling back to standard supabase client");
      const result = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      profiles = result.data;
      error = result.error;
      
      if (error) {
        console.error('Error fetching profiles with standard client:', error);
        throw new Error('Failed to fetch profiles: ' + error.message);
      }
    }
    
    console.log(`Successfully fetched ${profiles?.length || 0} profiles`);
    
    // Make sure to convert status fields and handle empty fields with proper defaults
    return (profiles || []).map(profile => ({
      ...profile,
      kyc_status: profile.kyc_status || 'not_submitted',
      name: profile.name || "Unknown User", // Ensure name has a fallback
      role: profile.role || 'user', // Ensure role has a fallback
      account_status: profile.account_status || 'active' as AccountStatus // Ensure account_status has a fallback
    })) as Profile[];
  } catch (error: any) {
    console.error('Error in getAllProfiles:', error);
    throw error;
  }
};

// Get user count for admin dashboard
export const getUserCount = async (adminId: string): Promise<number> => {
  try {
    // First check if the user is an admin using the is_admin function
    const { data: isAdmin, error: adminError } = await supabase
      .rpc('is_admin', { user_id: adminId });

    if (adminError || !isAdmin) {
      console.error('Error: Not authorized as admin', adminError);
      return 0;
    }
    
    console.log("Admin status confirmed, fetching user count");
    
    // Try both clients to get the count
    let count = 0;
    let error = null;
    
    try {
      // First try with supabaseAdmin
      const result = await supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      count = result.count || 0;
      error = result.error;
      
      if (error) {
        console.warn('Error using supabaseAdmin for count, falling back:', error);
      }
    } catch (adminError) {
      console.warn('Failed to use supabaseAdmin for count, falling back:', adminError);
      error = adminError;
    }

    // Fall back to standard client if admin client fails
    if (error || count === 0) {
      console.log("Falling back to standard supabase client for count");
      const result = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (!result.error) {
        count = result.count || 0;
      } else {
        console.error('Error fetching count with standard client:', result.error);
      }
    }
    
    console.log(`User count: ${count}`);
    return count;
  } catch (error) {
    console.error('Error in getUserCount:', error);
    return 0;
  }
};

// Get all transactions for admin view
export const getAllTransactions = async (adminId: string): Promise<Transaction[]> => {
  try {
    // First check if the user is an admin using the is_admin function
    const { data: isAdmin, error: adminError } = await supabase
      .rpc('is_admin', { user_id: adminId });

    if (adminError || !isAdmin) {
      console.error('Error: Not authorized as admin', adminError);
      return [];
    }
    
    console.log("Admin status confirmed, fetching all transactions");
    
    // Try both clients to fetch transactions
    let transactions = null;
    let error = null;
    
    try {
      // First try with supabaseAdmin
      const result = await supabaseAdmin
        .from('transactions')
        .select(`
          *,
          profiles:user_id (
            name, 
            id,
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      transactions = result.data;
      error = result.error;
      
      if (error) {
        console.warn('Error using supabaseAdmin for transactions, falling back:', error);
      } else {
        console.log(`Successfully fetched ${transactions?.length || 0} transactions with supabaseAdmin`);
      }
    } catch (adminError) {
      console.warn('Failed to use supabaseAdmin for transactions, falling back:', adminError);
      error = adminError;
    }

    // Fall back to standard client if admin client fails
    if (!transactions || error) {
      console.log("Falling back to standard supabase client for transactions");
      const result = await supabase
        .from('transactions')
        .select(`
          *,
          profiles:user_id (
            name, 
            id,
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      transactions = result.data;
      error = result.error;
      
      if (error) {
        console.error('Error fetching transactions with standard client:', error);
        return [];
      }
      
      console.log(`Successfully fetched ${transactions?.length || 0} transactions with standard client`);
    }
    
    // Format the data to include user_name
    return (transactions || []).map(transaction => {
      // Extract the profile data
      const profileData = transaction.profiles || null;
      
      return {
        ...transaction,
        // Safely get the name value
        user_name: profileData ? (profileData as any).name || 'Unknown User' : 'Unknown User'
      };
    }) as Transaction[];
  } catch (error: any) {
    console.error('Error in getAllTransactions:', error);
    return [];
  }
};

// Get detailed user profile by ID (admin only)
export const getUserDetailsByAdmin = async (adminId: string, userId: string): Promise<Profile | null> => {
  try {
    // First check if the user is an admin using the is_admin function
    const { data: isAdmin, error: adminError } = await supabase
      .rpc('is_admin', { user_id: adminId });

    if (adminError || !isAdmin) {
      console.error('Error: Not authorized as admin', adminError);
      return null;
    }
    
    // Use supabase client to fetch user details
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
    
    // Make sure to properly set defaults for nullable values
    return {
      ...data,
      kyc_status: data.kyc_status || 'not_submitted',
      account_status: data.account_status || 'active',
      wallet_balance: data.wallet_balance || 0,
      role: data.role || 'user'
    } as Profile;
  } catch (error) {
    console.error('Error in getUserDetailsByAdmin:', error);
    return null;
  }
};

// Update user wallet balance directly (admin only)
export const updateUserWalletBalance = async (adminId: string, userId: string, newBalance: number): Promise<boolean> => {
  try {
    // First check if the user is an admin using the is_admin function
    const { data: isAdmin, error: adminError } = await supabase
      .rpc('is_admin', { user_id: adminId });

    if (adminError || !isAdmin) {
      console.error('Error: Not authorized as admin', adminError);
      return false;
    }
    
    // Use supabaseAdmin client to update wallet balance
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ 
        wallet_balance: newBalance,
        updated_at: new Date().toISOString() 
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating user wallet balance:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateUserWalletBalance:', error);
    return false;
  }
};

// Delete user transaction (admin only)
export const deleteUserTransaction = async (adminId: string, transactionId: string): Promise<boolean> => {
  try {
    // First check if the user is an admin using the is_admin function
    const { data: isAdmin, error: adminError } = await supabase
      .rpc('is_admin', { user_id: adminId });

    if (adminError || !isAdmin) {
      console.error('Error: Not authorized as admin', adminError);
      return false;
    }
    
    // Use supabaseAdmin client to delete transaction
    const { error } = await supabaseAdmin
      .from('transactions')
      .delete()
      .eq('id', transactionId);
    
    if (error) {
      console.error('Error deleting transaction:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteUserTransaction:', error);
    return false;
  }
};
