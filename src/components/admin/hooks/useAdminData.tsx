
import { useState } from "react";
import { Profile } from "@/types/auth";
import { Transaction } from "@/services/transactions/types";
import { useAdminDataFetch } from "./useAdminDataFetch";
import { useKycManagement } from "./useKycManagement";
import { useAdminSubscriptions } from "./useAdminSubscriptions";
import { useAdminInitializer } from "./useAdminInitializer";

/**
 * Main hook for admin panel data management
 * This hook combines multiple specialized hooks to provide a unified interface
 */
export const useAdminData = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get the fetch function from the useAdminDataFetch hook
  const { fetchAllData } = useAdminDataFetch(setUsers, setTransactions, setLoading);
  
  // Get the KYC management function from the useKycManagement hook
  const { handleKycAction } = useKycManagement(users, setUsers);
  
  // Set up subscriptions using the useAdminSubscriptions hook
  useAdminSubscriptions(fetchAllData);
  
  // Initialize data on mount
  useAdminInitializer(fetchAllData);

  return {
    users,
    transactions,
    loading,
    fetchAllData,
    handleKycAction
  };
};
