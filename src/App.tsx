import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Services from "./pages/Services";
import KYC from "./pages/KYC";

// New pages
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

// Components
import SettingsPage from "./components/settings/SettingsPage";
import { AuthProvider } from "./contexts/auth";
import AdminLogin from "./pages/AdminLogin";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("anonpay_user");
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }
  
  return children;
};

// Create an admin-specific protected route
const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAdminAuth = () => {
      const admin = localStorage.getItem("anonpay_admin");
      if (admin) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };
    
    checkAdminAuth();
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    window.location.href = "/admin-login";
    return null;
  }
  
  return children;
};

// Root layout component to wrap the app with providers
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
};

// Update the router configuration to include the new routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout><Index /></RootLayout>,
  },
  {
    path: "/login",
    element: <RootLayout><Login /></RootLayout>,
  },
  {
    path: "/signup",
    element: <RootLayout><SignUp /></RootLayout>,
  },
  {
    path: "/forgot-password",
    element: <RootLayout><ForgotPassword /></RootLayout>,
  },
  {
    path: "/reset-password",
    element: <RootLayout><ResetPassword /></RootLayout>,
  },
  {
    path: "/verify-email",
    element: <RootLayout><VerifyEmail /></RootLayout>,
  },
  {
    path: "/dashboard",
    element: (
      <RootLayout>
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </RootLayout>
    ),
  },
  {
    path: "/admin-login",
    element: <RootLayout><AdminLogin /></RootLayout>,
  },
  {
    path: "/admin",
    element: (
      <RootLayout>
        <AdminProtectedRoute>
          <Admin />
        </AdminProtectedRoute>
      </RootLayout>
    ),
  },
  {
    path: "/settings",
    element: (
      <RootLayout>
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      </RootLayout>
    ),
  },
  {
    path: "/kyc",
    element: (
      <RootLayout>
        <ProtectedRoute>
          <KYC />
        </ProtectedRoute>
      </RootLayout>
    ),
  },
  {
    path: "/services/*",
    element: (
      <RootLayout>
        <ProtectedRoute>
          <Services />
        </ProtectedRoute>
      </RootLayout>
    ),
  },
  {
    path: "/about",
    element: <RootLayout><About /></RootLayout>,
  },
  {
    path: "/contact",
    element: <RootLayout><Contact /></RootLayout>,
  },
  {
    path: "/terms",
    element: <RootLayout><Terms /></RootLayout>,
  },
  {
    path: "/privacy",
    element: <RootLayout><Privacy /></RootLayout>,
  },
  {
    path: "*",
    element: <RootLayout><NotFound /></RootLayout>,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
