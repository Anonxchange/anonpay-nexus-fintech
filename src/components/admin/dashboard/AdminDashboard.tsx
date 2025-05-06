
import React from "react";
import StatisticsCards from "./StatisticsCards";
import { Profile } from "@/types/auth";
import { Transaction } from "@/services/transactions/types";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface AdminDashboardProps {
  users: Profile[];
  transactions: Transaction[];
  loading: boolean;
  onRefreshData: () => void;
  currentAdmin: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  transactions,
  loading,
  onRefreshData,
  currentAdmin
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-anonpay-primary"></div>
        <span className="ml-2">Loading admin panel data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, {currentAdmin.name || currentAdmin.email}
          </p>
          <p className="text-sm text-gray-400">
            Connected to Supabase. Total users: {users.length}, Total transactions: {transactions.length}
          </p>
        </div>
        <div>
          <Button 
            onClick={onRefreshData} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>

      <StatisticsCards users={users} transactions={transactions} />
    </div>
  );
};

export default AdminDashboard;
