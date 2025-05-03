import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ServiceTabs from "../components/services/ServiceTabs";
import { useAuth } from "../contexts/AuthContext";

const Services: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <AppLayout title="Services">
      <div className="max-w-5xl mx-auto">
        <Routes>
          <Route index element={<ServiceTabs user={user} />} />
          <Route path="crypto" element={<ServiceTabs user={user} />} />
          <Route path="gift-cards" element={<ServiceTabs user={user} />} />
          <Route path="vtu" element={<ServiceTabs user={user} />} />
          <Route path="*" element={<Navigate to="/services" replace />} />
        </Routes>
      </div>
    </AppLayout>
  );
};

export default Services;
