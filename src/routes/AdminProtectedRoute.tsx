
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
        // First check local storage
        const admin = localStorage.getItem("anonpay_admin");
        if (admin) {
          try {
            const adminData = JSON.parse(admin);
            
            // For local admin account
            if (adminData.id === "admin-1") {
              setIsAuthenticated(true);
            } else {
              // For Supabase authenticated admin, verify role
              const { data: { user } } = await supabase.auth.getUser();
              
              if (user && user.id === adminData.id) {
                // Verify admin role
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('role')
                  .eq('id', user.id)
                  .single();
                  
                if (profile?.role === 'admin') {
                  setIsAuthenticated(true);
                } else {
                  throw new Error("User is not an admin");
                }
              } else {
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
          }
        } else {
          // Try to check if current Supabase user is an admin
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            // Check if user has admin role
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('role, name')
              .eq('id', user.id)
              .single();
              
            if (!error && profile?.role === 'admin') {
              // Store admin data
              const adminData = {
                email: user.email,
                role: "admin",
                name: profile.name || user.email || "Admin User",
                id: user.id,
              };
              
              localStorage.setItem("anonpay_admin", JSON.stringify(adminData));
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
            }
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Admin authentication error:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminAuth();
  }, [toast]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-anonpay-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    navigate("/admin-login");
    return null;
  }
  
  return <>{children}</>;
};

export default AdminProtectedRoute;
