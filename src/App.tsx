
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createContext, useState, useContext, useEffect } from "react";

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

// Define user types
export type UserRole = "user" | "admin";
export type KycStatus = "pending" | "approved" | "rejected" | "not_submitted";
export type EmailStatus = "verified" | "unverified";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  emailStatus: EmailStatus;
  kycStatus: KycStatus;
  walletBalance: number;
  name?: string;
}

// Create auth context
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyEmail: (userId: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  verifyEmail: async () => {},
  resendVerificationEmail: async () => {},
  isLoading: false,
});

export const useAuth = () => useContext(AuthContext);

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: "1",
    email: "user@example.com",
    role: "user",
    emailStatus: "verified",
    kycStatus: "approved",
    walletBalance: 25000,
    name: "John Doe"
  },
  {
    id: "2",
    email: "admin@example.com",
    role: "admin",
    emailStatus: "verified",
    kycStatus: "approved",
    walletBalance: 50000,
    name: "Admin User"
  }
];

// Auth provider
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("anonpay_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("anonpay_user", JSON.stringify(foundUser));
    } else {
      throw new Error("Invalid credentials");
    }
    setIsLoading(false);
  };

  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      email,
      role: "user",
      emailStatus: "unverified",
      kycStatus: "not_submitted",
      walletBalance: 0
    };

    setUser(newUser);
    localStorage.setItem("anonpay_user", JSON.stringify(newUser));
    
    // This would trigger an email with MailerSend in a real app
    console.log(`Sending verification email to ${email}`);
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("anonpay_user");
  };

  const verifyEmail = async (userId: string) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (user && user.id === userId) {
      const updatedUser = { ...user, emailStatus: "verified" as EmailStatus };
      setUser(updatedUser);
      localStorage.setItem("anonpay_user", JSON.stringify(updatedUser));
    }
    setIsLoading(false);
  };

  const resendVerificationEmail = async () => {
    if (!user) return;
    
    // This would resend an email with MailerSend in a real app
    console.log(`Resending verification email to ${user.email}`);
  };

  return (
    <AuthContext.Provider 
      value={{ user, login, signup, logout, verifyEmail, resendVerificationEmail, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

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
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireVerified && user.emailStatus !== "verified") {
    return <Navigate to="/verify-email" replace />;
  }

  if (requiredRole === "admin" && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
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
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
