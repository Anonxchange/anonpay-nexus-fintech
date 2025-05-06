
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Profile, KycStatus, AccountStatus } from "@/types/auth";
import { Transaction } from "@/services/transactions/types";

export const useAdminDataFetch = (
  setUsers: React.Dispatch<React.SetStateAction<Profile[]>>,
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { toast } = useToast();
  
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      // Get admin data from local storage
      const adminData = localStorage.getItem("anonpay_admin");
      if (!adminData) {
        throw new Error("Admin data not found");
      }
      
      const admin = JSON.parse(adminData);
      
      // Direct fetch from profiles table for admin - without filters
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Try to fetch auth users data to get email information
      // This is not required but adds email data if available
      let authUsers: any[] = [];
      try {
        // Attempt to fetch auth users - this will work if the admin has the right permissions
        const { data: authUsersResponse, error: authUsersError } = await supabase.auth.admin.listUsers();
        
        if (!authUsersError && authUsersResponse) {
          authUsers = authUsersResponse.users || [];
          console.log('Successfully fetched auth users:', authUsers.length);
        } else {
          console.warn('Cannot access auth.admin.listUsers, continuing with limited data:', authUsersError);
        }
      } catch (error) {
        console.warn('Error accessing auth users:', error);
        // Continue without auth users data
      }
      
      // Direct fetch from transactions table for admin with extended details
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*, profiles:user_id(name, id, email, kyc_status, wallet_balance, account_status)')
        .order('created_at', { ascending: false });
      
      if (transactionsError) {
        console.error('Error fetching transactions:', transactionsError);
        throw transactionsError;
      }
      
      // Format profiles data and merge with auth users data
      const formattedProfiles = profilesData.map(profile => {
        // Find matching auth user to get email
        const authUser = authUsers.find(user => user?.id === profile.id);
        
        // Create a profile object with all required fields and fallbacks
        const formattedProfile: Profile = {
          id: profile.id,
          name: profile.name || authUser?.email || "Unknown User",
          avatar_url: profile.avatar_url,
          kyc_status: (profile.kyc_status as KycStatus) || 'not_submitted',
          wallet_balance: profile.wallet_balance || 0,
          phone_number: profile.phone_number,
          role: profile.role || 'user',
          email: authUser?.email || "No email available",
          created_at: profile.created_at || new Date().toISOString(),
          updated_at: profile.updated_at || new Date().toISOString(),
          account_status: (profile.account_status as AccountStatus) || 'active',
          kyc_submissions: []
        };
        
        return formattedProfile;
      });
      
      // Format transactions data
      const formattedTransactions = transactionsData.map(transaction => {
        const profileData = transaction.profiles || null;
        
        return {
          ...transaction,
          user_name: profileData && typeof profileData === 'object' ? 
            (profileData as any).name || 'Unknown User' : 'Unknown User',
          user_email: profileData && typeof profileData === 'object' ? 
            (profileData as any).email : null,
          user_kyc_status: profileData && typeof profileData === 'object' ? 
            (profileData as any).kyc_status : null,
          user_account_status: profileData && typeof profileData === 'object' ? 
            (profileData as any).account_status || 'active' : 'active'
        };
      });
      
      console.log('Fetched profiles:', formattedProfiles.length);
      console.log('Fetched transactions:', formattedTransactions.length);
      
      setUsers(formattedProfiles);
      setTransactions(formattedTransactions as unknown as Transaction[]);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load admin dashboard data."
      });
    } finally {
      setLoading(false);
    }
  }, [toast, setUsers, setTransactions, setLoading]);
  
  return { fetchAllData };
};
