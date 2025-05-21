
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
          setAdmin(parsedAdmin);
        } else {
          console.log("No admin data in localStorage, checking Supabase auth...");
          // Try to get the current user from Supabase
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            console.log("Found Supabase user:", user);
            // Check if the user has admin role in user_profiles
            const { data: profileData, error } = await supabase
              .from('user_profiles')
              .select('role, user_id')
              .eq('user_id', user.id)
              .single();
              
            if (error) {
              console.error("Error fetching profile:", error);
              throw new Error("Failed to fetch user profile");
            }
            
            console.log("User profile data:", profileData);
            // Safe access to properties
            const role = profileData?.role || 'user';
            
            if (role === 'admin') {
              console.log("User has admin role");
              // Create admin data object
              const adminUser = {
                email: user.email || '',
                name: user.email || 'Admin User',
                role: role,
                id: user.id
              };
              
              // Store admin data in local storage
              localStorage.setItem("anonpay_admin", JSON.stringify(adminUser));
              setAdmin(adminUser);
            } else {
              console.log("User is not an admin (role:", role, ")");
              // User is not an admin
              toast({
                variant: "destructive",
                title: "Access Denied",
                description: "You don't have permission to access the admin panel."
              });
              navigate("/dashboard");
            }
          } else {
            console.log("No authenticated user found");
          }
        }
      } catch (error) {
        console.error("Error checking admin:", error);
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
