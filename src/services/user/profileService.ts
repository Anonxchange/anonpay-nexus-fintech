
import { supabase } from "@/integrations/supabase/client";
import { KycStatus, Profile, AccountStatus } from "@/types/auth";

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
    
    // Ensure account_status has a default value if not present in the database
    const profile = {
      ...data,
      account_status: data.account_status || 'active' as AccountStatus
    } as Profile;
    
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
      id: userId,
      name: null,
      avatar_url: null,
      kyc_status: 'not_submitted' as KycStatus,
      wallet_balance: 0,
      phone_number: null,
      role: 'user',
      account_status: 'active' as AccountStatus,
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

// Update user profile
export const updateUserProfile = async (userId: string, profileData: Partial<Profile>): Promise<boolean> => {
  try {
    // First check if user has auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return false;
    }
    
    // Ensure we're only updating allowed fields
    const sanitizedData = {
      ...(profileData.name !== undefined && { name: profileData.name }),
      ...(profileData.avatar_url !== undefined && { avatar_url: profileData.avatar_url }),
      ...(profileData.phone_number !== undefined && { phone_number: profileData.phone_number }),
      ...(profileData.kyc_status !== undefined && { kyc_status: profileData.kyc_status }),
      ...(profileData.account_status !== undefined && { account_status: profileData.account_status }),
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('profiles')
      .update(sanitizedData)
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
