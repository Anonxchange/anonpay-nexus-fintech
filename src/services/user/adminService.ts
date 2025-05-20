
import { supabase } from "@/integrations/supabase/client";
import { Profile, AccountStatus } from "@/types/auth";
import { Transaction } from "../transactions/types";

// Get all profiles for admin view - updated to correctly handle all users
export const getAllProfiles = async (adminId: string): Promise<Profile[]> => {
  try {
    // First check if the user is an admin using their ID
    const { data: adminData, error: adminError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', adminId)
      .single();

    // Safe access to role property
    const role = adminData?.role || 'user';

    if (adminError || role !== 'admin') {
      console.error('Error: Not authorized as admin');
      return [];
    }
    
    // Get all profiles without filters
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching profiles:', error);
      return [];
    }
    
    // Make sure to convert status fields and handle empty fields with proper defaults
    return profiles.map(profile => ({
      id: profile.user_id as string,
      name: profile.role || "Unknown User", // Using role as name since user_profiles doesn't have name
      avatar_url: null, // user_profiles doesn't have this
      phone_number: null, // user_profiles doesn't have this
      kyc_status: (profile.kyc_status as any) || 'not_submitted',
      wallet_balance: profile.balance || 0,
      role: profile.role || 'user',
      created_at: profile.created_at,
      updated_at: profile.updated_at,
      account_status: 'active' as AccountStatus // Default since user_profiles doesn't have this
    })) as Profile[];
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }
};

// Get all transactions for admin view
export const getAllTransactions = async (adminId: string): Promise<Transaction[]> => {
  try {
    // First check if the user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', adminId)
      .single();

    // Safe access to role property
    const role = adminData?.role || 'user';

    if (adminError || role !== 'admin') {
      console.error('Error: Not authorized as admin');
      return [];
    }
    
    const { data, error } = await supabase
      .from('transactions')
      .select('*, user_profiles:user_id(role, user_id, kyc_status, balance)')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
    
    // Format the data to include user_name
    const formattedTransactions = data.map(transaction => {
      // Extract the profile data
      const profileData = transaction.user_profiles || null;
      
      return {
        ...transaction,
        // Safely get the name value (using role since user_profiles doesn't have name)
        user_name: profileData && typeof profileData === 'object' ? 
          (profileData as any).role || 'Unknown User' : 'Unknown User'
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
    // First check if the user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', adminId)
      .single();

    // Safe access to role property
    const role = adminData?.role || 'user';

    if (adminError || role !== 'admin') {
      console.error('Error: Not authorized as admin');
      return null;
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
    
    // Make sure to properly set defaults for nullable values and map to Profile type
    return {
      id: data.user_id as string,
      name: data.role || "Unknown User", // Using role since user_profiles doesn't have name
      avatar_url: null, // user_profiles doesn't have this
      phone_number: null, // user_profiles doesn't have this
      kyc_status: data.kyc_status || 'not_submitted',
      wallet_balance: data.balance || 0,
      role: data.role || 'user',
      created_at: data.created_at,
      updated_at: data.updated_at,
      account_status: 'active' as AccountStatus // Default since user_profiles doesn't have this
    } as Profile;
  } catch (error) {
    console.error('Error in getUserDetailsByAdmin:', error);
    return null;
  }
};

// Update user wallet balance directly (admin only)
export const updateUserWalletBalance = async (adminId: string, userId: string, newBalance: number): Promise<boolean> => {
  try {
    // First check if the user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', adminId)
      .single();

    // Safe access to role property
    const role = adminData?.role || 'user';

    if (adminError || role !== 'admin') {
      console.error('Error: Not authorized as admin');
      return false;
    }
    
    const { error } = await supabase
      .from('user_profiles')
      .update({ 
        balance: newBalance,
        updated_at: new Date().toISOString() 
      })
      .eq('user_id', userId);
    
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
    // First check if the user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', adminId)
      .single();

    // Safe access to role property
    const role = adminData?.role || 'user';

    if (adminError || role !== 'admin') {
      console.error('Error: Not authorized as admin');
      return false;
    }
    
    const { error } = await supabase
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
