
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useKycActions = (
  handleKycAction: (userId: string, action: "approve" | "reject") => Promise<void>
) => {
  const [processingUser, setProcessingUser] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAction = async (userId: string, action: "approve" | "reject") => {
    try {
      setProcessingUser(userId);
      await handleKycAction(userId, action);
      toast({
        title: `KYC ${action === "approve" ? "Approved" : "Rejected"}`,
        description: `User KYC has been ${action === "approve" ? "approved" : "rejected"} successfully.`,
      });
    } catch (error) {
      console.error(`Error in ${action} KYC:`, error);
      toast({
        variant: "destructive",
        title: "Action Failed",
        description: `Failed to ${action} KYC. Please try again.`,
      });
    } finally {
      setProcessingUser(null);
    }
  };

  const handleViewUser = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };

  return {
    processingUser,
    handleAction,
    handleViewUser
  };
};
