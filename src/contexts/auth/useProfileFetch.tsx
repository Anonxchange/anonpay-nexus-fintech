
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile, KycStatus, AccountStatus } from '../../types/auth';

export const useProfileFetch = () => {
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      setIsProfileLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
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
          id: userId, // Map user_id to id
          name: data.role || null,
          avatar_url: null, // user_profiles doesn't have this
          phone_number: null, // user_profiles doesn't have this
          kyc_status: data.kyc_status as KycStatus || 'not_submitted',
          wallet_balance: data.balance || 0,
          role: data.role || 'user',
          created_at: data.created_at,
          updated_at: data.updated_at,
          account_status: 'active' as AccountStatus // Default since user_profiles doesn't have this
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
        .from('user_profiles')
        .insert({ 
          user_id: userId,
          balance: 0,
          kyc_status: 'not_submitted' as KycStatus,
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
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
      console.error('Error creating profile:', error);
      return null;
    }
  };

  const refreshProfile = async (userId: string) => {
    if (userId) {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          return null;
        } else {
          // Map to Profile type
          const profile: Profile = {
            id: userId,
            name: profileData.role || null,
            avatar_url: null,
            phone_number: null,
            kyc_status: profileData.kyc_status as KycStatus || 'not_submitted',
            wallet_balance: profileData.balance || 0,
            role: profileData.role || 'user',
            created_at: profileData.created_at,
            updated_at: profileData.updated_at,
            account_status: 'active' as AccountStatus
          };
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
