
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import KycForm from "../kyc/KycForm";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { KycSubmission } from "@/types/kyc";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface KycServiceProps {
  user: any;
}

const KycService: React.FC<KycServiceProps> = ({ user }) => {
  const { profile, refreshProfile } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [kycSubmission, setKycSubmission] = useState<KycSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  
  const kycStatus = profile?.kyc_status || "not_submitted";
  
  useEffect(() => {
    const fetchKycSubmission = async () => {
      if (user?.id) {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('kyc_submissions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          if (!error && data) {
            setKycSubmission(data as KycSubmission);
          }
        } catch (error) {
          console.error("Error fetching KYC submission:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchKycSubmission();
  }, [user]);
  
  const handleCompleteSubmission = async () => {
    setShowForm(false);
    if (refreshProfile) {
      await refreshProfile();
    }
    
    // Fetch the latest KYC submission
    if (user?.id) {
      try {
        const { data, error } = await supabase
          .from('kyc_submissions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (!error && data) {
          setKycSubmission(data as KycSubmission);
        }
      } catch (error) {
        console.error("Error fetching KYC submission:", error);
      }
    }
  };
  
  const renderKycStatus = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    switch (kycStatus.toLowerCase()) {
      case "approved":
        return (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800">KYC Verified</AlertTitle>
            <AlertDescription className="text-green-700">
              Your identity has been verified. You have full access to all platform features.
            </AlertDescription>
          </Alert>
        );
      case "pending":
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
      case "rejected":
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
                onClick={() => setShowForm(true)}
              >
                Resubmit KYC
              </Button>
            </AlertDescription>
          </Alert>
        );
      default:
        return (
          <Alert variant="default" className="bg-blue-50 border-blue-200">
            <AlertTitle className="text-blue-800">KYC Required</AlertTitle>
            <AlertDescription>
              <p className="text-blue-700 mb-3">Please complete your KYC verification to unlock all features of the platform.</p>
              <Button 
                variant="outline" 
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
                onClick={() => setShowForm(true)}
              >
                Start KYC Process
              </Button>
            </AlertDescription>
          </Alert>
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
              <KycForm onComplete={handleCompleteSubmission} />
            </div>
          )}
          
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Why is KYC required?</h4>
            <p className="text-sm text-gray-600">
              KYC verification helps us comply with financial regulations and protect our users from fraud. 
              By verifying your identity, we can provide you with secure access to all our services.
            </p>
            
            <h4 className="text-sm font-medium mt-4 mb-2">What happens after submission?</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Our compliance team will review your documents</li>
              <li>You'll receive a notification when your KYC is approved or rejected</li>
              <li>If approved, you'll gain access to all platform features</li>
              <li>If rejected, you'll be asked to resubmit with corrections</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KycService;
