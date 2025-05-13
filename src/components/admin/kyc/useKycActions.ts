

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KycAction } from "@/services/products/types";

export const useKycActions = (
  onAction: (userId: string, action: KycAction) => Promise<void>
) => {
  const [processingUser, setProcessingUser] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAction = async (userId: string, action: KycAction) => {
    try {
      setProcessingUser(userId);
      await onAction(userId, action);
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

