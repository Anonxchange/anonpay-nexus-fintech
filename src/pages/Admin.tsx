
import React, { useEffect, useState } from "react";
import AdminPanel from "../components/admin/AdminPanel";
import AdminLayout from "../components/layout/AdminLayout";
import { Navigate, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminUser {
  email: string;
  name: string;
  role: string;
  id: string;
}

const Admin: React.FC = () => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        console.log("Checking admin status...");
        // First check local storage for admin session
        const adminData = localStorage.getItem("anonpay_admin");
        
        if (adminData) {
          // If admin data exists in local storage, use it
          const parsedAdmin = JSON.parse(adminData);
          console.log("Found admin data in localStorage:", parsedAdmin);
          
          // If it's a local admin with the specific UUID, we trust it
          if (parsedAdmin.id === "11111111-1111-1111-1111-111111111111") {
            console.log("Local admin with valid UUID found");
            setAdmin(parsedAdmin);
          } else {
            // For Supabase users, verify admin role
            console.log("Checking Supabase admin with ID:", parsedAdmin.id);
            // Check if the user is actually an admin using is_admin function
            const { data: isAdmin, error: isAdminError } = await supabase
              .rpc('is_admin', { user_id: parsedAdmin.id });
              
            if (isAdminError) {
              console.error("Error checking admin status:", isAdminError);
              throw new Error("Failed to verify admin status");
            }
            
            if (isAdmin) {
              console.log("Admin role confirmed via is_admin function");
              setAdmin(parsedAdmin);
            } else {
              console.error("User is not an admin according to is_admin function");
              throw new Error("User is not an admin");
            }
          }
        } else {
          console.log("No admin data in localStorage, checking current Supabase user");
          // Try to get the current user from Supabase
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
              setAdmin(adminData);
            } else {
              console.log("Current user is not an admin");
              setAdmin(null);
              navigate("/admin-login");
            }
          } else {
            console.log("No authenticated user found");
            navigate("/admin-login");
          }
        }
      } catch (error) {
        console.error("Admin authentication error:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Failed to verify admin access. Please log in again."
        });
        localStorage.removeItem("anonpay_admin");
        navigate("/admin-login");
      } finally {
        setLoading(false);
      }
    };
    
    checkAdmin();
  }, [navigate, toast]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-anonpay-primary"></div>
      </div>
    );
  }
  
  if (!admin) {
    return <Navigate to="/admin-login" replace />;
  }
  
  return (
    <AdminLayout title="Admin Dashboard">
      <div className="max-w-7xl mx-auto">
        <AdminPanel currentAdmin={admin} />
      </div>
    </AdminLayout>
  );
};

export default Admin;
