
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import KycForm from "../kyc/KycForm";

interface KycServiceProps {
  user: any;
}

const KycService: React.FC<KycServiceProps> = ({ user }) => {
  const { profile } = useAuth();
  const [showForm, setShowForm] = useState(false);
  
  const kycStatus = profile?.kyc_status || "not_submitted";
  
  const renderKycStatus = () => {
    switch (kycStatus.toLowerCase()) {
      case "approved":
        return (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md">
            <h3 className="font-medium text-green-800">KYC Verified</h3>
            <p>Your identity has been verified. You have full access to all platform features.</p>
          </div>
        );
      case "pending":
        return (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-md">
            <h3 className="font-medium text-yellow-800">KYC Under Review</h3>
            <p>We are currently reviewing your submitted documents. This process typically takes 1-2 business days.</p>
          </div>
        );
      case "rejected":
        return (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            <h3 className="font-medium text-red-800">KYC Rejected</h3>
            <p>Your verification was not approved. Please submit new documents addressing the issues.</p>
            <Button 
              variant="outline" 
              className="mt-3"
              onClick={() => setShowForm(true)}
            >
              Resubmit KYC
            </Button>
          </div>
        );
      default:
        return (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-md">
            <h3 className="font-medium text-blue-800">KYC Required</h3>
            <p>Please complete your KYC verification to unlock all features of the platform.</p>
            <Button 
              variant="outline" 
              className="mt-3"
              onClick={() => setShowForm(true)}
            >
              Start KYC Process
            </Button>
          </div>
        );
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
              <KycForm onComplete={() => setShowForm(false)} />
            </div>
          )}
          
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Why is KYC required?</h4>
            <p className="text-sm text-gray-600">
              KYC verification helps us comply with financial regulations and protect our users from fraud. 
              By verifying your identity, we can provide you with secure access to all our services.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KycService;
