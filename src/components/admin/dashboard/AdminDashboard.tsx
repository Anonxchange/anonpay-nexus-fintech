
import React from "react";
import StatisticsCards from "./StatisticsCards";
import { Profile } from "@/types/auth";
import { Transaction } from "@/services/transactions/types";
import { Button } from "@/components/ui/button";
import { RefreshCw, Users, CreditCard, Calendar, AlertTriangle } from "lucide-react";

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
  // Calculate statistics
  const pendingKyc = users.filter(user => user.kyc_status === "pending").length;
  const totalTransactions = transactions.length;
  const totalWalletBalance = users.reduce((sum, user) => sum + (user.wallet_balance || 0), 0);
  
  // Recent registrations (last 7 days)
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const recentUsers = users.filter(user => 
    user.created_at && new Date(user.created_at) > lastWeek
  ).length;

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
          <p className="text-gray-500">
            Welcome back, {currentAdmin.name || currentAdmin.email}
          </p>
          <p className="text-sm text-gray-400">
            Connected to Supabase. Total users: {users.length}, Total transactions: {transactions.length}
          </p>
        </div>
        <Button 
          onClick={onRefreshData} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-xs text-green-500 mt-1">+{recentUsers} new this week</p>
            </div>
            <div className="bg-blue-50 p-2 rounded-full">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Transactions</p>
              <p className="text-2xl font-bold">{totalTransactions}</p>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </div>
            <div className="bg-purple-50 p-2 rounded-full">
              <CreditCard className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Wallet Balance</p>
              <p className="text-2xl font-bold">₦{totalWalletBalance.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Across all users</p>
            </div>
            <div className="bg-green-50 p-2 rounded-full">
              <CreditCard className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending KYC</p>
              <p className="text-2xl font-bold">{pendingKyc}</p>
              <p className="text-xs text-amber-500 mt-1">Requires attention</p>
            </div>
            <div className="bg-amber-50 p-2 rounded-full">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </div>
      </div>

      <StatisticsCards users={users} transactions={transactions} />
    </div>
  );
};

export default AdminDashboard;
