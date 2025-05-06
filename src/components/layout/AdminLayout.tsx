
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Shield, User, Settings, Home, CreditCard, Users, BarChart2 } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title = "Admin" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("anonpay_admin");
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-anonpay-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-6 w-6 mr-2" />
            <span className="text-xl font-bold">AnonPay Admin</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-white hover:bg-anonpay-primary/80" onClick={handleLogout}>
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{title}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Admin Sidebar & Content */}
      <div className="container mx-auto px-4 py-4 flex flex-col lg:flex-row gap-4">
        {/* Sidebar */}
        <div className="w-full lg:w-64 bg-white shadow rounded-lg p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 uppercase mb-2">Main</p>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/admin")}>
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/admin?tab=users")}>
              <Users className="mr-2 h-4 w-4" />
              Users
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/admin?tab=transactions")}>
              <BarChart2 className="mr-2 h-4 w-4" />
              Transactions
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/admin?tab=rates")}>
              <CreditCard className="mr-2 h-4 w-4" />
              Rates
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/admin?tab=settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {title && (
            <h1 className="text-2xl font-bold mb-6">{title}</h1>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
