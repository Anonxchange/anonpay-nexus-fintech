
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth";

interface RootLayoutProps {
  children: React.ReactNode;
}

// Create the QueryClient outside the component to avoid recreation on each render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster />
          {children}
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default RootLayout;
