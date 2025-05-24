
import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Set up auth listener first to catch immediate changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          console.log("Auth state changed:", event, session?.user?.id);
          if (event === 'SIGNED_IN') {
            setAuthenticated(true);
          } else if (event === 'SIGNED_OUT') {
            setAuthenticated(false);
            navigate("/login", { replace: true });
          }
        });

        // Then check for an existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Session found, user is authenticated");
          setAuthenticated(true);
        } else {
          console.log("No authenticated session found, redirecting to login");
          toast({
            title: "Authentication required",
            description: "Please log in to access this page",
            variant: "default"
          });
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
    
    // Clean up auth listener
    return () => {
      supabase.auth.onAuthStateChange(() => {});
    };
  }, [navigate, toast]);
  
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
