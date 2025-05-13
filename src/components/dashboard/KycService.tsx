
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import KycForm from "../kyc/KycForm";
import { useKycService } from "./kyc/useKycService";
import KycApprovedStatus from "./kyc/KycApprovedStatus";
import KycPendingStatus from "./kyc/KycPendingStatus";
import KycRejectedStatus from "./kyc/KycRejectedStatus";
import KycRequiredStatus from "./kyc/KycRequiredStatus";
import KycLoadingState from "./kyc/KycLoadingState";
import KycInfoSection from "./kyc/KycInfoSection";

interface KycServiceProps {
  user: any;
}

const KycService: React.FC<KycServiceProps> = ({ user }) => {
  const {
    kycStatus,
    kycSubmission,
    showForm,
    setShowForm,
    loading,
    handleCompleteSubmission
  } = useKycService(user);
  
  const renderKycStatus = () => {
    if (loading) {
      return <KycLoadingState />;
    }
    
    switch (kycStatus.toLowerCase()) {
      case "approved":
        return <KycApprovedStatus />;
      case "pending":
        return <KycPendingStatus kycSubmission={kycSubmission} />;
      case "rejected":
        return <KycRejectedStatus 
          kycSubmission={kycSubmission} 
          onResubmit={() => setShowForm(true)} 
        />;
      default:
        return <KycRequiredStatus onStartKyc={() => setShowForm(true)} />;
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">KYC Verification</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Know Your Customer (KYC)</CardTitle>
          <CardDescription>Verify your identity to unlock all platform features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderKycStatus()}
          
          {showForm && (kycStatus.toLowerCase() === "not_submitted" || kycStatus.toLowerCase() === "rejected") && (
            <div className="mt-6">
              <KycForm onComplete={handleCompleteSubmission} />
            </div>
          )}
          
          <KycInfoSection />
        </CardContent>
      </Card>
    </div>
  );
};

export default KycService;
