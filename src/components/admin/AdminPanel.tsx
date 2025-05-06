
import React, { useEffect, useState } from "react";
import { useAdminData } from "./hooks/useAdminData";
import AdminDashboard from "./dashboard/AdminDashboard";
import AdminTabs from "./tabs/AdminTabs";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <Button 
          onClick={fetchAllData} 
          variant="outline"
          className="flex items-center gap-2"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

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
