
import React from "react";
import { createBrowserRouter } from "react-router-dom";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import VerifyEmail from "@/pages/VerifyEmail";
import Services from "@/pages/Services";
import KYC from "@/pages/KYC";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";

// Components
import SettingsPage from "@/components/settings/SettingsPage";
import AdminLogin from "@/pages/AdminLogin";

// Route Guards
import RootLayout from "./RootLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";

// Create and export the router configuration
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

export default router;
