
import { useEffect } from "react";

/**
 * Hook to handle initial data fetching for admin panel
 */
export const useAdminInitializer = (fetchAllData: () => Promise<void>) => {
  useEffect(() => {
    // Fetch data on component mount
    fetchAllData();
  }, [fetchAllData]);
  
  return null;
};
