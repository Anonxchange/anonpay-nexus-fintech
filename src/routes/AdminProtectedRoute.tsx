
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        console.log("Checking admin authentication status");
        // First check local storage
        const adminData = localStorage.getItem("anonpay_admin");
        if (adminData) {
          try {
            const adminObj = JSON.parse(adminData);
            console.log("Found admin data in localStorage:", adminObj);
            
            // For local admin account
            if (adminObj.id === "admin-1") {
              console.log("Local admin account verified");
              setIsAuthenticated(true);
            } else {
              // For Supabase authenticated admin, verify role
              console.log("Verifying Supabase admin with ID:", adminObj.id);
              const { data: { user } } = await supabase.auth.getUser();
              
              if (user && user.id === adminObj.id) {
                // Verify admin role with the is_admin function
                const { data: isAdmin, error } = await supabase
                  .rpc('is_admin', { user_id: user.id });
                  
                if (error) {
                  console.error("Error checking admin status:", error);
                  throw new Error("Failed to verify admin status");
                }
                
                if (isAdmin) {
                  console.log("Admin role confirmed via is_admin function");
                  setIsAuthenticated(true);
                } else {
                  console.error("User is not an admin according to is_admin function");
                  throw new Error("User is not an admin");
                }
              } else {
                console.error("User ID mismatch or no user found");
                throw new Error("Invalid admin data");
              }
            }
          } catch (error) {
            console.error("Error parsing admin data:", error);
            toast({
              variant: "destructive",
              title: "Authentication Error",
              description: "Your admin session is invalid. Please log in again."
            });
            localStorage.removeItem("anonpay_admin");
            setIsAuthenticated(false);
            navigate("/admin-login");
          }
        } else {
          // Try to check if current Supabase user is an admin
          console.log("No admin data in localStorage, checking current Supabase user");
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
            } else {
              console.log("Current user is not an admin");
              setIsAuthenticated(false);
              navigate("/admin-login");
            }
          } else {
            console.log("No authenticated user found");
            setIsAuthenticated(false);
            navigate("/admin-login");
          }
        }
      } catch (error) {
        console.error("Admin authentication error:", error);
        setIsAuthenticated(false);
        navigate("/admin-login");
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminAuth();
  }, [toast, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-anonpay-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null;
  }
  
  return <>{children}</>;
};

export default AdminProtectedRoute;
