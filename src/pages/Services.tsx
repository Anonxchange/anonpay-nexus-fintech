
import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ServiceTabs from "../components/services/ServiceTabs";
import { useAuth } from "../contexts/auth";

const Services: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  // Get the active service from the path
  const activeService = location.pathname.split('/').pop() || "crypto";
  
  return (
    <AppLayout title="Services">
      <div className="max-w-5xl mx-auto">
        <Routes>
          <Route index element={<Navigate to="/services/crypto" replace />} />
          <Route path="crypto" element={<ServiceTabs user={user} activeTab="crypto" />} />
          <Route path="gift-cards" element={<ServiceTabs user={user} activeTab="gift-cards" />} />
          <Route path="vtu" element={<ServiceTabs user={user} activeTab="vtu" />} />
          <Route path="rate-checker" element={<ServiceTabs user={user} activeTab="rate-checker" />} />
          <Route path="*" element={<Navigate to="/services/crypto" replace />} />
        </Routes>
      </div>
    </AppLayout>
  );
};

export default Services;
