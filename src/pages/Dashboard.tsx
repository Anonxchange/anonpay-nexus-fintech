
import React from "react";
import { useAuth } from "../contexts/auth";
import AppLayout from "../components/layout/AppLayout";
import DashboardTabs from "../components/dashboard/DashboardTabs";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <AppLayout title="Dashboard">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <DashboardTabs />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
