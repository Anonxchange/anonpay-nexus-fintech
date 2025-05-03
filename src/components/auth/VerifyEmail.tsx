
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const VerifyEmailComponent: React.FC = () => {
  const { user, resendVerificationEmail } = useAuth();
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();

  const handleResend = async () => {
    if (resendCooldown > 0 || !user) return;
    
    try {
      setIsResending(true);
      await resendVerificationEmail();
      
      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link.",
      });
      
      // Start cooldown
      setResendCooldown(60);
      const countdownInterval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to resend",
        description: "Please try again later.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
        <Mail className="w-8 h-8 text-amber-600" />
      </div>
      
      <h2 className="text-2xl font-semibold mb-2">Verify your email</h2>
      <p className="text-center text-gray-600 mb-6">
        We've sent a verification link to <strong>{user?.email}</strong>.<br />
        Please check your inbox and follow the instructions.
      </p>
      
      <div className="space-y-4 w-full">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleResend}
          disabled={isResending || resendCooldown > 0}
        >
          {isResending ? (
            <span className="flex items-center">
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </span>
          ) : resendCooldown > 0 ? (
            `Resend email (${resendCooldown}s)`
          ) : (
            "Resend verification email"
          )}
        </Button>
        
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => navigate("/login")}
        >
          Back to login
        </Button>
      </div>
    </div>
  );
};

export default VerifyEmailComponent;
