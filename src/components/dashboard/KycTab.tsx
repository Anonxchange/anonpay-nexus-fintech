
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import KycForm from "../kyc/KycForm";
import { useAuth } from "@/contexts/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileCheck } from "lucide-react";

const KycTab = () => {
  const { profile } = useAuth();
  const kycStatus = profile?.kyc_status || "not_submitted";
  
  return (
    <div className="space-y-6">
      {kycStatus === "approved" && (
        <Alert className="bg-green-50 border-green-200">
          <FileCheck className="h-4 w-4 text-green-600" />
          <AlertTitle>KYC Approved</AlertTitle>
          <AlertDescription>
            Your KYC verification has been approved. You have full access to all features.
          </AlertDescription>
        </Alert>
      )}
      
      {kycStatus === "pending" && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <FileCheck className="h-4 w-4 text-yellow-600" />
          <AlertTitle>KYC Pending</AlertTitle>
          <AlertDescription>
            Your KYC verification is under review. This usually takes 24-48 hours.
          </AlertDescription>
        </Alert>
      )}
      
      {(kycStatus === "not_submitted" || kycStatus === "rejected") && (
        <KycForm />
      )}
      
      {kycStatus === "rejected" && (
        <Alert className="bg-red-50 border-red-200">
          <FileCheck className="h-4 w-4 text-red-600" />
          <AlertTitle>KYC Rejected</AlertTitle>
          <AlertDescription>
            Your KYC verification was rejected. Please submit again with correct information.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default KycTab;
