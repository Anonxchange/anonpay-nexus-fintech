
import React from "react";
import { useAdminData } from "./hooks/useAdminData";
import AdminDashboard from "./dashboard/AdminDashboard";
import AdminTabs from "./tabs/AdminTabs";

const AdminPanel = ({ currentAdmin }: { currentAdmin: any }) => {
  const { 
    users, 
    transactions, 
    loading, 
    fetchAllData, 
    handleKycAction 
  } = useAdminData();

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
        />
      )}
    </div>
  );
};

export default AdminPanel;
