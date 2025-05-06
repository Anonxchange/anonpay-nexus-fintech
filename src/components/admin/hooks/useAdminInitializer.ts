
import { useEffect } from "react";

/**
 * Hook to initialize admin data on component mount
 */
export const useAdminInitializer = (fetchAllData: () => Promise<void>) => {
  useEffect(() => {
    console.log("Initializing admin data...");
    // Fetch data on mount
    fetchAllData().then(() => {
      console.log("Initial admin data fetched successfully");
    }).catch(error => {
      console.error("Error fetching initial admin data:", error);
    });
  }, [fetchAllData]);
};
