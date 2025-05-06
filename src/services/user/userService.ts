import { supabase } from "@/integrations/supabase/client";
import { KycStatus, Profile } from "@/types/auth";
import { Transaction } from "../transactions/types";

// Get user profile data
export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      
      // If profile doesn't exist, create a new one
      if (error.code === 'PGRST116') {
        return createUserProfile(userId);
      }
      return null;
    }
    
    return data as Profile;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
};

// Create a new user profile
export const createUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const newProfile = {
      id: userId,
      name: null,
      avatar_url: null,
      kyc_status: 'not_submitted' as KycStatus,
      wallet_balance: 0,
      phone_number: null,
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('profiles')
      .insert(newProfile)
      .select('*')
      .single();
      
    if (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
    
    return data as Profile;
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    return null;
  }
};

// Get all profiles for admin view - updated to use auth.uid() with RLS
export const getAllProfiles = async (adminId: string): Promise<Profile[]> => {
  try {
    // First check if the user is an admin using their ID
    const { data: adminData, error: adminError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', adminId)
      .single();

    // Safe access to role property
    const role = adminData?.role || 'user';

    if (adminError || role !== 'admin') {
      console.error('Error: Not authorized as admin');
      return [];
    }
    
    // Get all profiles - this will work with RLS if the admin policy is set up
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching profiles:', error);
      return [];
    }
    
    // Make sure to convert kyc_status to the correct type and handle empty name fields
    return profiles.map(profile => ({
      ...profile,
      kyc_status: (profile.kyc_status as KycStatus) || 'not_submitted',
      name: profile.name || "Unknown User", // Ensure name has a fallback
      role: profile.role || 'user' // Ensure role has a fallback
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
      .from('profiles')
      .select('role')
      .eq('id', adminId)
      .single();

    // Safe access to role property
    const role = adminData?.role || 'user';

    if (adminError || role !== 'admin') {
      console.error('Error: Not authorized as admin');
      return [];
    }
    
    const { data, error } = await supabase
      .from('transactions')
      .select('*, profiles:user_id(name)')
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

// Update user profile
export const updateUserProfile = async (userId: string, profileData: Partial<Profile>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return false;
  }
};

// Add advanced admin functions for managing users

// Update user wallet balance directly (admin only)
export const updateUserWalletBalance = async (adminId: string, userId: string, newBalance: number): Promise<boolean> => {
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
      console.error('Error: Not authorized as admin');
      return false;
    }
    
    const { error } = await supabase
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
    // First check if the user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', adminId)
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

// Get detailed user profile by ID (admin only)
export const getUserDetailsByAdmin = async (adminId: string, userId: string): Promise<Profile | null> => {
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
      console.error('Error: Not authorized as admin');
      return null;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
    
    return data as Profile;
  } catch (error) {
    console.error('Error in getUserDetailsByAdmin:', error);
    return null;
  }
};

// Update user account status (active, suspended, blocked)
export const updateUserAccountStatus = async (adminId: string, userId: string, status: string): Promise<boolean> => {
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
      console.error('Error: Not authorized as admin');
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
      console.error('Error: Not authorized as admin');
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
    
    // Get KYC submissions for the user if the table exists
    let kycSubmissions = [];
    try {
      const { data: kycData, error: kycError } = await supabase
        .from('kyc_submissions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (!kycError) {
        kycSubmissions = kycData || [];
      }
    } catch (error) {
      console.log('KYC submissions table might not exist yet:', error);
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
