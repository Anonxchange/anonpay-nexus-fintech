
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Check } from "lucide-react";
import { setUserAsAdmin } from "@/services/user/accountService";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminSetupGuide = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSetCurrentUserAsAdmin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError("No authenticated user found. Please log in first.");
        return;
      }
      
      console.log("Setting current user as admin:", user.id);
      
      // Set user as admin
      await setUserAsAdmin(user.id);
      
      setSuccess(true);
      toast({
        title: "Success!",
        description: "You have been set as an admin. Please log into the admin panel.",
      });
    } catch (error: any) {
      console.error("Error setting user as admin:", error);
      setError(error.message || "An unexpected error occurred");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to set user as admin",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Admin Setup Guide</CardTitle>
        <CardDescription>Follow these steps to set up an admin account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {success ? (
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-700">Success!</AlertTitle>
            <AlertDescription className="text-green-600">
              Your account has been set as admin. You can now access the admin panel at <a href="/admin" className="font-medium underline">the admin dashboard</a>.
            </AlertDescription>
          </Alert>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="text-sm">
            <p className="mb-2">
              If you are seeing empty data in the admin panel, you may need to set your account as an admin in the database.
            </p>
            <p>Click the button below to set your current user account as an admin:</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!success && (
          <Button 
            onClick={handleSetCurrentUserAsAdmin} 
            disabled={loading || success}
            className="w-full"
          >
            {loading ? "Processing..." : "Set Current User as Admin"}
          </Button>
        )}
        {success && (
          <Button 
            variant="outline" 
            onClick={() => window.location.href = "/admin"}
            className="w-full"
          >
            Go to Admin Dashboard
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AdminSetupGuide;
