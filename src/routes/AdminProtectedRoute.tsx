
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // First check if we have admin data in localStorage
        const adminData = localStorage.getItem("anonpay_admin");
        
        if (adminData) {
          console.log("Admin data found in localStorage");
          setIsAdmin(true);
          setLoading(false);
          return;
        }
        
        // If not in localStorage, check current auth session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No authenticated session");
          setLoading(false);
          return;
        }
        
        const userId = session.user.id;
        console.log("Checking admin status for user:", userId);
        
        // Check if user has admin role in user_profiles
        const { data, error } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('user_id', userId)
          .single();
        
        if (error) {
          console.error("Error checking admin status:", error);
          throw error;
        }
        
        const role = data?.role;
        console.log("User role:", role);
        
        if (role === 'admin') {
          console.log("User is admin");
          // Create and store admin data
          const adminUser = {
            email: session.user.email || '',
            name: session.user.email || 'Admin User',
            role: 'admin',
            id: userId
          };
          
          localStorage.setItem("anonpay_admin", JSON.stringify(adminUser));
          setIsAdmin(true);
        } else {
          console.log("User is not admin");
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You don't have permission to access the admin panel."
          });
        }
      } catch (error) {
        console.error("Error in admin auth check:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Failed to verify admin access."
        });
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [toast]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-anonpay-primary"></div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }
  
  return <>{children}</>;
};

export default AdminProtectedRoute;
