
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface KycRequiredStatusProps {
  onStartKyc: () => void;
}

const KycRequiredStatus: React.FC<KycRequiredStatusProps> = ({ onStartKyc }) => {
  return (
    <Alert variant="default" className="bg-blue-50 border-blue-200">
      <AlertTitle className="text-blue-800">KYC Required</AlertTitle>
      <AlertDescription>
        <p className="text-blue-700 mb-3">Please complete your KYC verification to unlock all features of the platform.</p>
        <Button 
          variant="outline" 
          className="border-blue-300 text-blue-700 hover:bg-blue-50"
          onClick={onStartKyc}
        >
          Start KYC Process
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default KycRequiredStatus;
