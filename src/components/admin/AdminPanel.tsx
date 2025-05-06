
import React, { useEffect, useState } from "react";
import { useAdminData } from "./hooks/useAdminData";
import AdminDashboard from "./dashboard/AdminDashboard";
import AdminTabs from "./tabs/AdminTabs";
import { useSearchParams } from "react-router-dom";

const AdminPanel = ({ currentAdmin }: { currentAdmin: any }) => {
  const { 
    users, 
    transactions, 
    loading, 
    fetchAllData, 
    handleKycAction 
  } = useAdminData();
  
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'users';
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    // Set active tab based on URL parameter
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <AdminDashboard 
        users={users}
        transactions={transactions}
        loading={loading}
        onRefreshData={fetchAllData}
        currentAdmin={currentAdmin}
      />

      {!loading && (
        <AdminTabs 
          users={users} 
          transactions={transactions}
          handleKycAction={handleKycAction}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}
    </div>
  );
};

export default AdminPanel;
