
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/auth";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset
} from "@/components/ui/sidebar";
import { 
  CreditCard as BankIcon, 
  User as UserIcon, 
  Settings, 
  FileText as KycIcon 
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import DashboardOverview from "../components/dashboard/DashboardOverview";
import MyAccount from "../components/dashboard/MyAccount";
import KycService from "../components/dashboard/KycService";
import AddBankAccount from "../components/dashboard/AddBankAccount";
import { useNavigate } from "react-router-dom";
import { Profile } from "@/types/auth";

const Dashboard: React.FC = () => {
  const { user, profile, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <AppLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-anonpay-primary"></div>
          <span className="ml-3">Loading dashboard...</span>
        </div>
      </AppLayout>
    );
  }
  
  if (!user || !profile) {
    return null; // This shouldn't render as the useEffect will redirect to login
  }
  
  // Check if user account is suspended or blocked
  if (profile.account_status === 'suspended' || profile.account_status === 'blocked') {
    return (
      <AppLayout title="Account Restricted">
        <div className="flex flex-col items-center justify-center h-64 text-center max-w-md mx-auto">
          <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4 w-full">
            <h2 className="text-lg font-semibold mb-2">Account {profile.account_status}</h2>
            <p>Your account has been {profile.account_status}. Please contact support for assistance.</p>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview user={user} />;
      case "myaccount":
        return <MyAccount user={user} />;
      case "kyc":
        return <KycService user={user} />;
      case "bankaccount":
        return <AddBankAccount user={user} />;
      default:
        return <DashboardOverview user={user} />;
    }
  };
  
  return (
    <AppLayout title="Dashboard">
      <SidebarProvider defaultOpen={true}>
        <div className="flex w-full">
          <Sidebar>
            <SidebarHeader className="border-b px-6 py-2">
              <h2 className="text-lg font-semibold">Dashboard</h2>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab("overview")} 
                    isActive={activeTab === "overview"}
                    tooltip="Services"
                  >
                    <Settings className="mr-2" />
                    <span>Services</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab("myaccount")} 
                    isActive={activeTab === "myaccount"}
                    tooltip="My Account"
                  >
                    <UserIcon className="mr-2" />
                    <span>My Account</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab("kyc")} 
                    isActive={activeTab === "kyc"}
                    tooltip="KYC Service"
                  >
                    <KycIcon className="mr-2" />
                    <span>KYC Service</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab("bankaccount")} 
                    isActive={activeTab === "bankaccount"}
                    tooltip="Add Bank Account"
                  >
                    <BankIcon className="mr-2" />
                    <span>Add Bank Account</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <div className="p-6">
              {renderContent()}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AppLayout>
  );
};

export default Dashboard;
