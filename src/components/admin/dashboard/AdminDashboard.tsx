
import React from "react";
import StatisticsCards from "./StatisticsCards";
import { Profile } from "@/types/auth";
import { Transaction } from "@/services/transactions/types";

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
        </div>
        <div>
          <button 
            onClick={onRefreshData} 
            className="bg-anonpay-primary hover:bg-anonpay-primary/90 text-white px-3 py-2 rounded-md text-sm"
          >
            Refresh Data
          </button>
        </div>
      </div>

      <StatisticsCards users={users} transactions={transactions} />
    </div>
  );
};

export default AdminDashboard;
