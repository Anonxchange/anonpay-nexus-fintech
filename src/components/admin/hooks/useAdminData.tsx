
import { useState, useEffect } from "react";
import { getAllProfiles, getAllTransactions, updateKycStatus } from "@/services/user/userService";
import { Profile } from "@/types/auth";
import { Transaction } from "@/services/transactions/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAdminData = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Function to fetch all data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch all profiles and transactions
      const profilesData = await getAllProfiles();
      const transactionsData = await getAllTransactions();
      
      setUsers(profilesData);
      setTransactions(transactionsData);
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
  };

  const handleKycAction = async (userId: string, action: "approve" | "reject") => {
    try {
      const status = action === "approve" ? "approved" : "rejected";
      const success = await updateKycStatus(userId, status);
      
      if (success) {
        // Update the local state immediately before the real-time update arrives
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
      } else {
        toast({
          variant: "destructive",
          title: "Action Failed",
          description: `Failed to ${action} KYC. Please try again.`,
        });
        return Promise.reject(new Error(`Failed to ${action} KYC`));
      }
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
  }, [toast]);

  return {
    users,
    transactions,
    loading,
    fetchAllData,
    handleKycAction
  };
};
