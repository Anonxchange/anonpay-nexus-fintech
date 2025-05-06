
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../contexts/auth";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import AccountTab from "../components/dashboard/AccountTab";
import KycTab from "../components/dashboard/KycTab";
import WithdrawalMethodTab from "../components/dashboard/WithdrawalMethodTab";
import SettingsPage from "../components/settings/SettingsPage";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract tab from URL or set default to 'account'
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'account';
  
  // Set tab in URL if not already set
  useEffect(() => {
    if (!searchParams.has('tab')) {
      navigate('/dashboard?tab=account', { replace: true });
    }
  }, [navigate, searchParams]);
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  const renderContent = () => {
    switch (currentTab) {
      case 'account':
        return <AccountTab />;
      case 'kyc':
        return <KycTab />;
      case 'withdrawal':
        return <WithdrawalMethodTab />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <AccountTab />;
    }
  };
  
  return (
    <AppLayout title="Dashboard">
      <div className="flex flex-col md:flex-row w-full gap-6">
        <SidebarProvider>
          <div className="w-full flex min-h-[600px]">
            <DashboardSidebar />
            <div className="flex-1 p-4 overflow-auto">
              {renderContent()}
            </div>
          </div>
        </SidebarProvider>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
