
import React from "react";
import Navbar from "./Navbar";
import { useAuth } from "../../contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const renderKycBanner = () => {
    if (!user || !profile) return null;
    
    if (profile.kyc_status === "not_submitted") {
      return (
        <Alert className="bg-amber-50 border-amber-200 mb-4">
          <AlertDescription className="flex items-center justify-between">
            <div>Your KYC is not submitted. Complete your verification to access all features.</div>
            <Link to="/kyc">
              <Button variant="outline" size="sm">Submit KYC</Button>
            </Link>
          </AlertDescription>
        </Alert>
      );
    } else if (profile.kyc_status === "pending") {
      return (
        <Alert className="bg-blue-50 border-blue-200 mb-4">
          <AlertDescription>
            Your KYC is being reviewed. We'll notify you once it's approved.
          </AlertDescription>
        </Alert>
      );
    } else if (profile.kyc_status === "rejected") {
      return (
        <Alert className="bg-red-50 border-red-200 mb-4">
          <AlertDescription className="flex items-center justify-between">
            <div>Your KYC was rejected. Please resubmit with correct information.</div>
            <Link to="/kyc">
              <Button variant="outline" size="sm">Resubmit</Button>
            </Link>
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        {title && <h1 className="text-2xl font-bold mb-6">{title}</h1>}
        
        {renderKycBanner()}
        
        {children}
      </main>

      <footer className="py-6 border-t bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} AnonPay. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
