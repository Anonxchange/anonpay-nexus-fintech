
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        console.log("Checking admin authentication status");
        setLoading(true);
        
        // First check local storage
        const adminData = localStorage.getItem("anonpay_admin");
        if (adminData) {
          try {
            const adminObj = JSON.parse(adminData);
            console.log("Found admin data in localStorage:", adminObj);
            
            // For local admin account with valid UUID
            if (adminObj.id === "11111111-1111-1111-1111-111111111111") {
              console.log("Local admin account with valid UUID verified");
              setIsAuthenticated(true);
              return;
            }
            
            // For Supabase authenticated admin, verify role
            console.log("Verifying Supabase admin with ID:", adminObj.id);
            // Verify admin role with the is_admin function
            const { data: isAdmin, error: isAdminError } = await supabase
              .rpc('is_admin', { user_id: adminObj.id });
              
            if (isAdminError) {
              console.error("Error checking admin status:", isAdminError);
              throw new Error("Failed to verify admin status");
            }
            
            if (isAdmin) {
              console.log("Admin role confirmed via is_admin function");
              setIsAuthenticated(true);
              return;
            } else {
              console.error("User is not an admin according to is_admin function");
              throw new Error("User is not an admin");
            }
          } catch (error: any) {
            console.error("Error verifying admin:", error);
            toast({
              variant: "destructive",
              title: "Authentication Error",
              description: "Your admin session is invalid. Please log in again."
            });
            localStorage.removeItem("anonpay_admin");
          }
        }
        
        // Try to check if current Supabase user is an admin
        console.log("No valid admin data in localStorage, checking current Supabase user");
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          console.log("Current Supabase user found:", user.id);
          // Check if user is admin using the is_admin function
          const { data: isAdmin, error } = await supabase
            .rpc('is_admin', { user_id: user.id });
            
          if (error) {
            console.error("Error checking admin status:", error);
            throw new Error("Failed to verify admin status");
          }
          
          if (isAdmin) {
            console.log("Admin role confirmed for current user via is_admin function");
            // Get profile to get name
            const { data: profile } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', user.id)
              .single();
              
            // Store admin data
            const adminData = {
              email: user.email,
              role: "admin",
              name: profile?.name || user.email || "Admin User",
              id: user.id,
            };
            
            localStorage.setItem("anonpay_admin", JSON.stringify(adminData));
            setIsAuthenticated(true);
            return;
          }
        }
        
        // If we get here, authentication failed
        console.log("Admin authentication failed, redirecting to login");
        setIsAuthenticated(false);
        navigate("/admin-login", { state: { from: location.pathname } });
      } catch (error: any) {
        console.error("Admin authentication error:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Failed to verify admin status. Please log in again."
        });
        setIsAuthenticated(false);
        navigate("/admin-login", { state: { from: location.pathname } });
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminAuth();
  }, [toast, navigate, location]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-anonpay-primary mx-auto mb-4" />
          <p className="text-gray-500">Verifying admin credentials...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Let the navigate in useEffect redirect us
  }
  
  return <>{children}</>;
};

export default AdminProtectedRoute;
