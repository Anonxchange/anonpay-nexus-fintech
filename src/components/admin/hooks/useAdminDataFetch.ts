
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
      
      // Direct fetch from profiles table for admin with extended details
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Also fetch auth users data to get email information
      const { data: authUsersData, error: authUsersError } = await supabase.auth.admin.listUsers();
      
      const authUsers = authUsersData?.users || [];
      
      if (authUsersError) {
        console.error('Error fetching auth users:', authUsersError);
        // Continue with just profiles data if auth users fetch fails
      }
      
      // Direct fetch from transactions table for admin with extended details
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*, profiles:user_id(name, id, email, kyc_status, wallet_balance)')
        .order('created_at', { ascending: false });
      
      if (transactionsError) {
        console.error('Error fetching transactions:', transactionsError);
        throw transactionsError;
      }
      
      // Format profiles data and merge with auth users data
      const formattedProfiles = profilesData.map(profile => {
        // Find matching auth user to get email
        const authUser = authUsers.find(user => user.id === profile.id);
        
        // Ensure account_status has a default value if it doesn't exist
        const account_status = profile.account_status || 'active' as AccountStatus;
        
        return {
          ...profile,
          email: authUser?.email || "No email available",
          kyc_status: (profile.kyc_status as KycStatus) || 'not_submitted',
          name: profile.name || authUser?.email || "Unknown User",
          role: profile.role || 'user',
          account_status: account_status,
          kyc_submissions: [] // Initialize with empty array as we don't have kyc_submissions table yet
        };
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
            (profileData as any).kyc_status : null
        };
      });
      
      console.log('Fetched profiles:', formattedProfiles);
      console.log('Fetched transactions:', formattedTransactions);
      
      // Type assertion to ensure compatibility with Profile type
      setUsers(formattedProfiles as unknown as Profile[]);
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
