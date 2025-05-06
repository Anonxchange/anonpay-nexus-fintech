
import React, { useEffect } from "react";
import { useAdminData } from "./hooks/useAdminData";
import AdminDashboard from "./dashboard/AdminDashboard";
import AdminTabs from "./tabs/AdminTabs";
import { supabase } from "@/integrations/supabase/client";

const AdminPanel = ({ currentAdmin }: { currentAdmin: any }) => {
  const { 
    users, 
    transactions, 
    loading, 
    fetchAllData, 
    handleKycAction 
  } = useAdminData();

  // Enable realtime for tables to ensure we get updates
  useEffect(() => {
    const setupRealtimeForAdmin = async () => {
      try {
        // Execute query to enable realtime on profiles table
        await supabase.rpc('get_all_profiles');
        console.log("Admin panel initialized with realtime capabilities");
      } catch (error) {
        console.error("Error setting up admin panel:", error);
      }
    };

    setupRealtimeForAdmin();
  }, []);

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
