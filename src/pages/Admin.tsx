
import React, { useEffect, useState } from "react";
import AdminPanel from "../components/admin/AdminPanel";
import AdminLayout from "../components/layout/AdminLayout";
import { Navigate } from "react-router-dom";

interface AdminUser {
  email: string;
  name: string;
  role: string;
  id: string;
}

const Admin: React.FC = () => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAdmin = () => {
      const adminData = localStorage.getItem("anonpay_admin");
      if (adminData) {
        setAdmin(JSON.parse(adminData));
      }
      setLoading(false);
    };
    
    checkAdmin();
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!admin) {
    return <Navigate to="/admin-login" replace />;
  }
  
  return (
    <AdminLayout title="Admin Dashboard">
      <div className="max-w-7xl mx-auto">
        <AdminPanel currentAdmin={admin} />
      </div>
    </AdminLayout>
  );
};

export default Admin;
