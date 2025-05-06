import React from "react";
import AppLayout from "../components/layout/AppLayout";
import AdminPanel from "../components/admin/AdminPanel";
import { useAuth } from "../contexts/auth";
import { Navigate } from "react-router-dom";

const Admin: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <AppLayout title="Admin Panel">
      <div className="max-w-7xl mx-auto">
        <AdminPanel currentAdmin={user} />
      </div>
    </AppLayout>
  );
};

export default Admin;
