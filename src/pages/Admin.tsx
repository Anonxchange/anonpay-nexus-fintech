
import React, { useEffect, useState } from "react";
import AdminPanel from "../components/admin/AdminPanel";
import AdminLayout from "../components/layout/AdminLayout";
import { Navigate, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import AdminSetupGuide from "../components/admin/AdminSetupGuide";

interface AdminUser {
  email: string;
  name: string;
  role: string;
  id: string;
}

const Admin: React.FC = () => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        console.log("Checking admin status...");
        setError(null);
        
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
            return;
          }
          
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
            return;
          } else {
            console.error("User is not an admin according to is_admin function");
            throw new Error("User is not an admin");
          }
        }
        
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
            return;
          } else {
            console.log("Current user is not an admin");
            setError("Your account does not have admin privileges.");
          }
        } else {
          console.log("No authenticated user found");
          setError("No authenticated user found. Please log in as an admin.");
        }
      } catch (error: any) {
        console.error("Admin authentication error:", error);
        setError(error.message || "Authentication error");
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Failed to verify admin access. Please log in again."
        });
        localStorage.removeItem("anonpay_admin");
      } finally {
        setLoading(false);
      }
    };
    
    checkAdmin();
  }, [navigate, toast]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-anonpay-primary mx-auto mb-4" />
          <p className="text-gray-500">Loading admin panel...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <AdminLayout title="Admin Access">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
            <h2 className="text-lg font-semibold mb-2">Admin Access Required</h2>
            <p>{error}</p>
          </div>
          <AdminSetupGuide />
          <div className="flex justify-center mt-4">
            <button 
              onClick={() => navigate("/admin-login")} 
              className="px-4 py-2 bg-anonpay-primary text-white rounded-md hover:bg-anonpay-secondary"
            >
              Go to Admin Login
            </button>
          </div>
        </div>
      </AdminLayout>
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
