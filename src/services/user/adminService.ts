
import { supabase } from "@/integrations/supabase/client";
import { supabaseAdmin } from "@/integrations/supabase/adminClient";
import { Profile, AccountStatus } from "@/types/auth";
import { Transaction } from "../transactions/types";

// Get all profiles for admin view - updated to correctly handle all users
export const getAllProfiles = async (adminId: string): Promise<Profile[]> => {
  try {
    // First check if the user is an admin using the is_admin function
    const { data: isAdmin, error: adminError } = await supabase
      .rpc('is_admin', { user_id: adminId });

    if (adminError || !isAdmin) {
      console.error('Error: Not authorized as admin', adminError);
      return [];
    }
    
    // Use supabaseAdmin client to fetch all profiles without restrictions
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching profiles:', error);
      return [];
    }
    
    // Make sure to convert status fields and handle empty fields with proper defaults
    return profiles.map(profile => ({
      ...profile,
      kyc_status: (profile.kyc_status as any) || 'not_submitted',
      name: profile.name || "Unknown User", // Ensure name has a fallback
      role: profile.role || 'user', // Ensure role has a fallback
      account_status: profile.account_status || 'active' as AccountStatus // Ensure account_status has a fallback
    })) as Profile[];
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return [];
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
    
    // Use supabaseAdmin client to get the exact count
    const { count, error } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error fetching user count:', error);
      return 0;
    }
    
    return count || 0;
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
    
    // Use supabaseAdmin client to fetch transactions
    const { data, error } = await supabaseAdmin
      .from('transactions')
      .select('*, profiles:user_id(name, id, email, kyc_status, wallet_balance)')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
    
    // Format the data to include user_name
    const formattedTransactions = data.map(transaction => {
      // Extract the profile data
      const profileData = transaction.profiles || null;
      
      return {
        ...transaction,
        // Safely get the name value
        user_name: profileData && typeof profileData === 'object' ? 
          (profileData as any).name || 'Unknown User' : 'Unknown User'
      };
    });
    
    // First convert to unknown then to Transaction[] to handle the type mismatch
    return formattedTransactions as unknown as Transaction[];
  } catch (error) {
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
    
    // Use supabaseAdmin client to fetch user details
    const { data, error } = await supabaseAdmin
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
