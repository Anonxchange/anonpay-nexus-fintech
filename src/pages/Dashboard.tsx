import React from "react";
import AppLayout from "../components/layout/AppLayout";
import DashboardOverview from "../components/dashboard/DashboardOverview";
import { useAuth } from "../contexts/auth";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <AppLayout title="Dashboard">
      <DashboardOverview user={user} />
    </AppLayout>
  );
};

export default Dashboard;
