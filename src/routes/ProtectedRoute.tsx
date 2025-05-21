
import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for an existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Session found, user is authenticated");
          setAuthenticated(true);
        } else {
          console.log("No authenticated session found, redirecting to login");
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-anonpay-primary"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // User is authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;
