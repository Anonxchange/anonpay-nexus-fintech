
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

const KycApprovedStatus: React.FC = () => {
  return (
    <Alert variant="default" className="bg-green-50 border-green-200">
      <CheckCircle className="h-5 w-5 text-green-600" />
      <AlertTitle className="text-green-800">KYC Verified</AlertTitle>
      <AlertDescription className="text-green-700">
        Your identity has been verified. You have full access to all platform features.
      </AlertDescription>
    </Alert>
  );
};

export default KycApprovedStatus;
