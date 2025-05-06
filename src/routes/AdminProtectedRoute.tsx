
import React, { useState, useEffect } from "react";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAdminAuth = () => {
      const admin = localStorage.getItem("anonpay_admin");
      if (admin) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };
    
    checkAdminAuth();
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    window.location.href = "/admin-login";
    return null;
  }
  
  return children;
};

export default AdminProtectedRoute;
