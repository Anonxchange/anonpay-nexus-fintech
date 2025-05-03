import React from "react";
import AppLayout from "../components/layout/AppLayout";
import KycForm from "../components/kyc/KycForm";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { KycStatus } from "../App";

const KYC: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  const handleKycSubmit = async (data: any) => {
    // In a real app, we'd submit this data to a backend
    // For demo purposes, we'll just simulate the update in local storage
    
    const updatedUser = {
      ...user,
      kycStatus: "pending" as KycStatus,
      name: data.fullName
    };
    
    localStorage.setItem("anonpay_user", JSON.stringify(updatedUser));
    
    toast({
      title: "KYC submitted successfully",
      description: "Your identity will be verified soon.",
    });
    
    navigate("/dashboard");
  };
  
  return (
    <AppLayout title="KYC Verification">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-medium mb-2">Know Your Customer (KYC)</h2>
          <p className="text-gray-600 mb-4">
            To comply with regulations and ensure the security of our platform, we require all users to complete KYC verification.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Verification typically takes 24-48 hours to process.</p>
            <p>• Please ensure all submitted documents are clear and legible.</p>
            <p>• Your information is encrypted and securely stored.</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <KycForm user={user} onSubmit={handleKycSubmit} />
        </div>
      </div>
    </AppLayout>
  );
};

export default KYC;
