
import { useState, useEffect } from "react";
import { Profile } from "@/types/auth";
import { Transaction } from "@/services/transactions/types";
import { KycAction } from "@/services/products/types";
import { getAllProfiles, getUserCount } from "@/services/user/adminService";
import { getAllTransactions } from "@/services/user/adminService";
import { useAdminSubscriptions } from "./useAdminSubscriptions";
import { useToast } from "@/hooks/use-toast";

export const useAdminData = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userCount, setUserCount] = useState(0);
  const { toast } = useToast();

  // Function to handle KYC approval/rejection
  const handleKycAction = async (userId: string, action: KycAction) => {
    try {
      // Implementation to be added
      toast({
        title: "KYC Action",
        description: `KYC ${action} for user ${userId} is not yet implemented`,
      });
      // After successful action, refresh the data
      fetchAllData();
      return true;
    } catch (error) {
      console.error("Error in KYC action:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process KYC action",
      });
      return false;
    }
  };

  // Function to fetch all admin data
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching all admin data...");
      const adminData = localStorage.getItem("anonpay_admin");
      if (!adminData) {
        throw new Error("Admin data not found");
      }
      
      const admin = JSON.parse(adminData);
      console.log("Using admin ID:", admin.id);
      
      // Fetch profiles and user count
      const profiles = await getAllProfiles(admin.id);
      setUsers(profiles);
      
      const count = await getUserCount(admin.id);
      setUserCount(count);
      
      // Fetch transactions
      const txs = await getAllTransactions(admin.id);
      setTransactions(txs);
      
      console.log(`Loaded ${profiles.length} profiles and ${txs.length} transactions`);
    } catch (error: any) {
      console.error("Error fetching admin data:", error);
      setError(error.message || "Failed to load admin data");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load admin dashboard data"
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, []);

  // Set up realtime subscriptions
  useAdminSubscriptions(fetchAllData);

  return {
    users,
    transactions,
    loading,
    fetchAllData,
    handleKycAction,
    userCount,
    error
  };
};
