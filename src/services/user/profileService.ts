
import { supabase } from "@/integrations/supabase/client";
import { KycStatus, Profile } from "@/types/auth";

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
