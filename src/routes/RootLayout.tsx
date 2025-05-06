
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth";

interface RootLayoutProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
