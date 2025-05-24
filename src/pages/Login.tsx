
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import LoginForm from "../components/auth/LoginForm";
import { useAuth } from "../contexts/auth";

const Login: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (!isLoading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, isLoading, navigate]);

  // If still loading auth state, show loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-anonpay-primary"></div>
      </div>
    );
  }
  
  // Only show login form if user is not authenticated
  if (!user) {
    return (
      <AuthLayout
        title="Welcome back"
        subtitle="Enter your credentials to access your account"
      >
        <LoginForm />
      </AuthLayout>
    );
  }
  
  // This should never render as the useEffect will redirect
  return null;
};

export default Login;
