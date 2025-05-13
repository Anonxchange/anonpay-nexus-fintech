
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KycSubmission } from "@/types/kyc";

interface KycRejectedStatusProps {
  kycSubmission: KycSubmission | null;
  onResubmit: () => void;
}

const KycRejectedStatus: React.FC<KycRejectedStatusProps> = ({ 
  kycSubmission,
  onResubmit 
}) => {
  return (
    <Alert variant="destructive" className="bg-red-50 border-red-300 text-red-800">
      <AlertCircle className="h-5 w-5 text-red-600" />
      <AlertTitle className="text-red-800">KYC Rejected</AlertTitle>
      <AlertDescription className="text-red-700">
        <p>Your verification was not approved. Please submit new documents addressing the issues.</p>
        {kycSubmission?.admin_notes && (
          <div className="mt-2 border rounded p-3 bg-white text-red-800 text-sm">
            <p className="font-medium">Reason for rejection:</p>
            <p>{kycSubmission.admin_notes}</p>
          </div>
        )}
        <Button 
          variant="outline" 
          className="mt-4 border-red-300 text-red-700 hover:bg-red-50"
          onClick={onResubmit}
        >
          Resubmit KYC
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default KycRejectedStatus;
