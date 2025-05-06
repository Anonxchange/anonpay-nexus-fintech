
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

// Get all profiles for admin view
export const getAllProfiles = async (): Promise<Profile[]> => {
  try {
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
      name: profile.name || "Unknown User" // Ensure name has a fallback
    })) as Profile[];
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }
};

// Get all transactions for admin view
export const getAllTransactions = async (): Promise<Transaction[]> => {
  try {
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
