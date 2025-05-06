
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile, KycStatus, AccountStatus } from '../../types/auth';

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
          kyc_status: data.kyc_status as KycStatus || 'not_submitted',
          wallet_balance: data.wallet_balance || 0,
          role: data.role || 'user',
          created_at: data.created_at,
          updated_at: data.updated_at,
          account_status: data.account_status as AccountStatus || 'active'
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
          role: 'user',
          account_status: 'active' as AccountStatus,
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
          // Ensure account_status is properly set
          const profile = {
            ...profileData,
            account_status: profileData.account_status || 'active'
          } as Profile;
          return profile;
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
