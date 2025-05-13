
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { KycSubmission } from "@/types/kyc";

interface KycPendingStatusProps {
  kycSubmission: KycSubmission | null;
}

const KycPendingStatus: React.FC<KycPendingStatusProps> = ({ kycSubmission }) => {
  return (
    <Alert variant="default" className="bg-yellow-50 border-yellow-200">
      <Clock className="h-5 w-5 text-yellow-600" />
      <AlertTitle className="text-yellow-800">KYC Under Review</AlertTitle>
      <AlertDescription className="text-yellow-700">
        We are currently reviewing your submitted documents. This process typically takes 1-2 business days.
        <div className="mt-4">
          {kycSubmission && (
            <div className="border rounded p-4 bg-white">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">Submission Details</h4>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  {kycSubmission.status.toUpperCase()}
                </Badge>
              </div>
              <div className="text-sm space-y-1 text-gray-700">
                <p><span className="font-medium">Submitted:</span> {new Date(kycSubmission.created_at).toLocaleString()}</p>
                <p><span className="font-medium">ID Type:</span> {kycSubmission.id_type?.replace('_', ' ').toUpperCase()}</p>
              </div>
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default KycPendingStatus;
