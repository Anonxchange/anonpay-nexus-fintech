import React, { useEffect, useState } from "react";
import { useAdminData } from "./hooks/useAdminData";
import AdminDashboard from "./dashboard/AdminDashboard";
import AdminTabs from "./tabs/AdminTabs";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateUserAccountStatus } from "@/services/user/accountService";

const AdminPanel = ({ currentAdmin }: { currentAdmin: any }) => {
  const { toast } = useToast();
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

  const handleUserAction = async (userId: string, action: string) => {
    try {
      let status = '';
      let message = '';
      
      switch (action) {
        case 'block':
          status = 'blocked';
          message = 'User has been blocked successfully';
          break;
        case 'activate':
          status = 'active';
          message = 'User has been activated successfully';
          break;
        case 'suspend':
          status = 'suspended';
          message = 'User has been suspended successfully';
          break;
        default:
          toast({
            variant: "destructive",
            title: "Error",
            description: "Invalid action specified",
          });
          return;
      }
      
      const success = await updateUserAccountStatus(currentAdmin.id, userId, status);
      
      if (success) {
        toast({
          title: "Success",
          description: message,
        });
        
        // Refresh the data
        fetchAllData();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update user status",
        });
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    }
  };

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
          handleUserAction={handleUserAction}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}
    </div>
  );
};

export default AdminPanel;
