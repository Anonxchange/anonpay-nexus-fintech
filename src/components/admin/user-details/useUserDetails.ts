
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { getUserDetailsByAdmin } from "@/services/user/adminService";
import { updateKycStatus } from "@/services/user/accountService";
import { Profile } from "@/types/auth";

export const useUserDetails = (userId: string | undefined) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        
        // Get admin data from local storage
        const adminData = localStorage.getItem("anonpay_admin");
        if (!adminData) {
          throw new Error("Admin data not found");
        }
        
        const admin = JSON.parse(adminData);
        
        const userData = await getUserDetailsByAdmin(admin.id, userId);
        if (userData) {
          setUser(userData);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load user details.",
          });
          navigate("/admin");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred while loading user details.",
        });
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserDetails();
  }, [userId, toast, navigate]);

  const handleKycAction = async (action: "approve" | "reject") => {
    if (!user) return;
    
    try {
      setProcessingAction(action);
      const status = action === "approve" ? "approved" : "rejected";
      const success = await updateKycStatus(user.id, status);
      
      if (success) {
        setUser({
          ...user,
          kyc_status: status as any,
          updated_at: new Date().toISOString()
        });
        
        toast({
          title: `KYC ${action === "approve" ? "Approved" : "Rejected"}`,
          description: `User KYC has been ${action === "approve" ? "approved" : "rejected"} successfully.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Action Failed",
          description: `Failed to ${action} KYC. Please try again.`,
        });
      }
    } catch (error) {
      console.error(`Error in ${action} KYC:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `An error occurred while ${action === "approve" ? "approving" : "rejecting"} KYC.`,
      });
    } finally {
      setProcessingAction(null);
    }
  };

  return {
    user,
    loading,
    processingAction,
    handleKycAction
  };
};
