
import React, { useEffect } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/auth";
import { useNavigate } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  fullWidth?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  title = "AnonPay",
  fullWidth = false,
}) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Set page title
  useEffect(() => {
    document.title = `${title} | AnonPay`;
  }, [title]);
  
  // Check authentication for protected routes
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-anonpay-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-grow py-10 ${fullWidth ? '' : 'container mx-auto px-4'}`}>
        <div className="max-w-7xl w-full mx-auto">
          {title && title !== "AnonPay" && (
            <h1 className="text-3xl font-semibold mb-6">{title}</h1>
          )}
          {children}
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default AppLayout;
