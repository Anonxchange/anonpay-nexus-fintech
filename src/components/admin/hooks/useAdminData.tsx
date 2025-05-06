
import { useState, useEffect, useCallback } from "react";
import { Profile, KycStatus } from "@/types/auth";
import { Transaction } from "@/services/transactions/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAdminData = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Function to fetch all data
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      // Get admin data from local storage
      const adminData = localStorage.getItem("anonpay_admin");
      if (!adminData) {
        throw new Error("Admin data not found");
      }
      
      const admin = JSON.parse(adminData);
      
      // Direct fetch from profiles table for admin
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }
      
      // Direct fetch from transactions table for admin
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*, profiles:user_id(name)')
        .order('created_at', { ascending: false });
      
      if (transactionsError) {
        console.error('Error fetching transactions:', transactionsError);
        throw transactionsError;
      }

      // Format profiles data
      const formattedProfiles = profilesData.map(profile => ({
        ...profile,
        kyc_status: (profile.kyc_status as KycStatus) || 'not_submitted',
        name: profile.name || "Unknown User",
        role: profile.role || 'user'
      }));
      
      // Format transactions data
      const formattedTransactions = transactionsData.map(transaction => {
        const profileData = transaction.profiles || null;
        
        return {
          ...transaction,
          user_name: profileData && typeof profileData === 'object' ? 
            (profileData as any).name || 'Unknown User' : 'Unknown User'
        };
      });
      
      console.log('Fetched profiles:', formattedProfiles);
      console.log('Fetched transactions:', formattedTransactions);
      
      setUsers(formattedProfiles as Profile[]);
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
  }, [toast]);

  const handleKycAction = async (userId: string, action: "approve" | "reject") => {
    try {
      const status = action === "approve" ? "approved" : "rejected";
      
      // Direct update to the profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ 
          kyc_status: status,
          updated_at: new Date().toISOString() 
        })
        .eq('id', userId);
      
      if (error) {
        console.error('Error updating KYC status:', error);
        throw error;
      }
      
      // Update the local state immediately
      setUsers(
        users.map((user) => {
          if (user.id === userId) {
            return {
              ...user,
              kyc_status: status as KycStatus,
              updated_at: new Date().toISOString()
            };
          }
          return user;
        })
      );

      toast({
        title: `KYC ${action === "approve" ? "Approved" : "Rejected"}`,
        description: `User KYC has been ${
          action === "approve" ? "approved" : "rejected"
        } successfully.`,
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error(`Error in ${action} KYC:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `An error occurred while ${action === "approve" ? "approving" : "rejecting"} KYC.`,
      });
      return Promise.reject(error);
    }
  };

  useEffect(() => {
    fetchAllData();
    
    // Set up real-time listeners for profiles and transactions tables
    const profilesChannel = supabase
      .channel('admin-profiles-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles'
        }, 
        (payload) => {
          console.log('Profile change received:', payload);
          // Refresh data when a profile changes
          fetchAllData();
        }
      )
      .subscribe();
      
    const transactionsChannel = supabase
      .channel('admin-transactions-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions'
        }, 
        (payload) => {
          console.log('Transaction change received:', payload);
          // Refresh data when a transaction changes
          fetchAllData();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(transactionsChannel);
    };
  }, [fetchAllData]);

  return {
    users,
    transactions,
    loading,
    fetchAllData,
    handleKycAction
  };
};
