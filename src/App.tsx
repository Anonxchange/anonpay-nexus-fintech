
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import KYC from "./pages/KYC";
import Admin from "./pages/Admin";
import Services from "./pages/Services";
import VerifyEmail from "./pages/VerifyEmail";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Context
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Define user types
export type UserRole = "user" | "admin";
export type KycStatus = "pending" | "approved" | "rejected" | "not_submitted" | "admin";
export type EmailStatus = "verified" | "unverified";

// Protected route component
const ProtectedRoute = ({ 
  children, 
  requiredRole = "user",
  requireVerified = true,
}: { 
  children: React.ReactNode,
  requiredRole?: UserRole,
  requireVerified?: boolean,
}) => {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireVerified && user.email_confirmed_at === null) {
    return <Navigate to="/verify-email" replace />;
  }

  if (requiredRole === "admin" && profile?.kyc_status !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/verify-email" element={
      <ProtectedRoute requireVerified={false}>
        <VerifyEmail />
      </ProtectedRoute>
    } />
    <Route path="/dashboard" element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } />
    <Route path="/kyc" element={
      <ProtectedRoute>
        <KYC />
      </ProtectedRoute>
    } />
    <Route path="/services/*" element={
      <ProtectedRoute>
        <Services />
      </ProtectedRoute>
    } />
    <Route path="/admin/*" element={
      <ProtectedRoute requiredRole="admin">
        <Admin />
      </ProtectedRoute>
    } />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Export auth hook and types to be used throughout the app
export { useAuth };
export type { Profile } from './contexts/AuthContext';

export default App;
