
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook to initialize admin data on component mount
 */
export const useAdminInitializer = (fetchAllData: () => Promise<void>) => {
  const { toast } = useToast();

  useEffect(() => {
    console.log("Initializing admin data...");
    // Fetch data on mount
    fetchAllData()
      .then(() => {
        console.log("Initial admin data fetched successfully");
      })
      .catch(error => {
        console.error("Error fetching initial admin data:", error);
        toast({
          variant: "destructive",
          title: "Data Loading Error",
          description: "Failed to load initial admin data. Please try refreshing the page.",
        });
      });
  }, [fetchAllData, toast]);
};
