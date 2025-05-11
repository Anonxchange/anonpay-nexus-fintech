
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { KycStatus, AccountStatus } from "@/types/auth";

interface StatusBadgeProps {
  status: KycStatus | AccountStatus | string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Convert status to lowercase string for consistent comparison
  const normalizedStatus = String(status).toLowerCase();
  
  // Define styling based on status
  let variant: "default" | "secondary" | "destructive" | "outline" | "success" = "default";
  let label = status;
  
  switch (normalizedStatus) {
    case "approved":
    case "active":
    case "completed":
    case "success":
      variant = "success";
      break;
      
    case "pending":
    case "processing":
    case "in_progress":
      variant = "secondary";
      break;
      
    case "rejected":
    case "blocked":
    case "suspended":
    case "failed":
    case "error":
      variant = "destructive";
      break;
      
    case "not_submitted":
    default:
      variant = "outline";
      // Format not_submitted to be more readable
      if (normalizedStatus === "not_submitted") {
        label = "Not Submitted";
      }
  }
  
  // Capitalize first letter of each word
  const formattedLabel = String(label)
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return (
    <Badge variant={variant}>
      {formattedLabel}
    </Badge>
  );
};

export default StatusBadge;
