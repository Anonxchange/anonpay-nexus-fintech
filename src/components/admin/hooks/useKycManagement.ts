
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { KycStatus, Profile } from "@/types/auth";

export const useKycManagement = (
  users: Profile[], 
  setUsers: React.Dispatch<React.SetStateAction<Profile[]>>
) => {
  const { toast } = useToast();
  
  const handleKycAction = useCallback(async (userId: string, action: "approve" | "reject") => {
    try {
      const status = action === "approve" ? "approved" : "rejected";
      
      // Direct update to the user_profiles table
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          kyc_status: status,
          updated_at: new Date().toISOString() 
        })
        .eq('user_id', userId);
      
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
  }, [users, setUsers, toast]);

  return { handleKycAction };
};
