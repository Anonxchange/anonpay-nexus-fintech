
import React from "react";
import Navbar from "./Navbar";
import { useAuth } from "@/contexts/auth";
import Footer from "./Footer";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
  const { user } = useAuth();
  
  // Default title if none provided
  const pageTitle = title ? `${title} | AnonPay` : "AnonPay";
  
  // Set document title
  React.useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        {title && (
          <h1 className="text-2xl font-bold mb-6">{title}</h1>
        )}
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;
