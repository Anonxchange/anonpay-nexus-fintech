
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      // If we have auth context data, process it
      if (user === null) {
        console.log("No authenticated user found, redirecting to login");
        navigate("/login");
      }
      
      setLoading(false);
    };
    
    // Only check auth if loading is true (initial load)
    if (loading) {
      checkAuth();
    }
  }, [user, navigate, loading]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-anonpay-primary"></div>
      </div>
    );
  }
  
  // We know user is authenticated at this point, render children
  return <>{children}</>;
};

export default ProtectedRoute;
