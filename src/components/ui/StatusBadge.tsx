
import React from "react";
import { cn } from "@/lib/utils";
import { KycStatus, EmailStatus } from "../../types/auth";
import { ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";

interface StatusBadgeProps {
  status: KycStatus | EmailStatus;
  type?: "kyc" | "email";
  showIcon?: boolean;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  type = "kyc", 
  showIcon = true,
  className 
}) => {
  let badgeClass = "";
  let label = "";
  let Icon = ShieldCheck;
  
  if (type === "kyc") {
    switch (status) {
      case "pending":
        badgeClass = "bg-yellow-100 text-yellow-800";
        label = "Pending";
        Icon = ShieldAlert;
        break;
      case "approved":
        badgeClass = "bg-green-100 text-green-800";
        label = "Approved";
        Icon = ShieldCheck;
        break;
      case "rejected":
        badgeClass = "bg-red-100 text-red-800";
        label = "Rejected";
        Icon = ShieldX;
        break;
      case "not_submitted":
        badgeClass = "bg-gray-100 text-gray-800";
        label = "Not Submitted";
        Icon = ShieldAlert;
        break;
    }
  } else {
    switch (status) {
      case "verified":
        badgeClass = "bg-green-100 text-green-800";
        label = "Verified";
        Icon = ShieldCheck;
        break;
      case "unverified":
        badgeClass = "bg-yellow-100 text-yellow-800";
        label = "Unverified";
        Icon = ShieldAlert;
        break;
    }
  }

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", 
      badgeClass,
      className
    )}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {label}
    </span>
  );
};

export default StatusBadge;
