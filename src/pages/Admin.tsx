
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
        // First check local storage for admin session
        const adminData = localStorage.getItem("anonpay_admin");
        
        if (adminData) {
          // If admin data exists in local storage, use it
          const parsedAdmin = JSON.parse(adminData);
          setAdmin(parsedAdmin);
        } else {
          // Try to get the current user from Supabase
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            // Check if the user has admin role in profiles
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('role, name')
              .eq('id', user.id)
              .single();
              
            if (error) {
              console.error("Error fetching profile:", error);
              throw new Error("Failed to fetch user profile");
            }
            
            // Safe access to properties using optional chaining
            const role = profileData?.role || 'user';
            
            if (role === 'admin') {
              // Create admin data object
              const adminUser = {
                email: user.email || '',
                name: profileData?.name || user.email || 'Admin User',
                role: role,
                id: user.id
              };
              
              // Store admin data in local storage
              localStorage.setItem("anonpay_admin", JSON.stringify(adminUser));
              setAdmin(adminUser);
            } else {
              // User is not an admin
              toast({
                variant: "destructive",
                title: "Access Denied",
                description: "You don't have permission to access the admin panel."
              });
              navigate("/dashboard");
            }
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
