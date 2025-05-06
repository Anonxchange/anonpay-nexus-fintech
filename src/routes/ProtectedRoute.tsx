
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Wait for the auth context to initialize
    if (!isLoading) {
      if (user === null) {
        console.log("No authenticated user found, redirecting to login");
        navigate("/login");
      }
      setLoading(false);
    }
  }, [user, navigate, isLoading]);
  
  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-anonpay-primary mr-3"></div>
        <span>Loading your account data...</span>
      </div>
    );
  }
  
  // We know user is authenticated at this point, render children
  return <>{children}</>;
};

export default ProtectedRoute;
