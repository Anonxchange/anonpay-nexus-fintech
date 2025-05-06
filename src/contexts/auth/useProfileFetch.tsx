
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile, KycStatus } from '../../types/auth';

export const useProfileFetch = () => {
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      setIsProfileLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        
        // If the profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          const newProfile = await createProfile(userId);
          return newProfile;
        }
        return null;
      } else {
        // Ensure the data conforms to the Profile type
        const profileData: Profile = {
          id: data.id,
          name: data.name || null,
          avatar_url: data.avatar_url,
          phone_number: data.phone_number,
          kyc_status: data.kyc_status as KycStatus,
          wallet_balance: data.wallet_balance || 0,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        return profileData;
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    } finally {
      setIsProfileLoading(false);
    }
  };

  // Create a new profile for a user if it doesn't exist
  const createProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({ 
          id: userId,
          wallet_balance: 0,
          kyc_status: 'not_submitted' as KycStatus,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return null;
      }

      return data as Profile;
    } catch (error) {
      console.error('Error creating profile:', error);
      return null;
    }
  };

  const refreshProfile = async (userId: string) => {
    if (userId) {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          return null;
        } else {
          return profileData as Profile;
        }
      } catch (error) {
        console.error("Failed to refresh profile:", error);
        return null;
      }
    }
    return null;
  };

  return {
    fetchProfile,
    refreshProfile,
    isProfileLoading
  };
};
