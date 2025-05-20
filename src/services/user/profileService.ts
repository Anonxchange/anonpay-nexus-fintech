
import { supabase } from "@/integrations/supabase/client";
import { KycStatus, Profile, AccountStatus } from "@/types/auth";

// Get user profile data
export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      
      // If profile doesn't exist, create a new one
      if (error.code === 'PGRST116') {
        return createUserProfile(userId);
      }
      return null;
    }
    
    // Map to Profile type with defaults for fields that don't exist in user_profiles
    const profile: Profile = {
      id: userId,
      name: data.role || null, // Using role since user_profiles doesn't have name
      avatar_url: null, // user_profiles doesn't have this
      phone_number: null, // user_profiles doesn't have this
      kyc_status: data.kyc_status as KycStatus || 'not_submitted',
      wallet_balance: data.balance || 0,
      role: data.role || 'user',
      created_at: data.created_at,
      updated_at: data.updated_at,
      account_status: 'active' as AccountStatus // Default since user_profiles doesn't have this
    };
    
    return profile;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
};

// Create a new user profile
export const createUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    // First check if user has auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user found');
      return null;
    }
    
    const newProfile = {
      user_id: userId,
      role: 'user',
      kyc_status: 'not_submitted' as KycStatus,
      balance: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(newProfile)
      .select('*')
      .single();
      
    if (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
    
    // Map to Profile type
    const profileData: Profile = {
      id: userId,
      name: data.role || null,
      avatar_url: null,
      phone_number: null,
      kyc_status: 'not_submitted' as KycStatus,
      wallet_balance: 0,
      role: 'user',
      created_at: data.created_at,
      updated_at: data.updated_at,
      account_status: 'active' as AccountStatus
    };
    
    return profileData;
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, profileData: Partial<Profile>): Promise<boolean> => {
  try {
    // First check if user has auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return false;
    }
    
    // Map Profile fields to user_profiles fields
    const sanitizedData = {
      ...(profileData.role !== undefined && { role: profileData.role }),
      ...(profileData.kyc_status !== undefined && { kyc_status: profileData.kyc_status }),
      ...(profileData.wallet_balance !== undefined && { balance: profileData.wallet_balance }),
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('user_profiles')
      .update(sanitizedData)
      .eq('user_id', userId);
    
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
