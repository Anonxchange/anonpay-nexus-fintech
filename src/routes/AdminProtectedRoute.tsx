
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAdminAuth = () => {
      const admin = localStorage.getItem("anonpay_admin");
      if (admin) {
        try {
          const adminData = JSON.parse(admin);
          // Check if admin data is valid
          if (adminData && adminData.id) {
            setIsAuthenticated(true);
          } else {
            throw new Error("Invalid admin data");
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
        setIsAuthenticated(false);
      }
      setLoading(false);
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
