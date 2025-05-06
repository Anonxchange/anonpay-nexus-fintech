
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { KycStatus, Profile } from "../../types/auth";
import { getAllProfiles, getAllTransactions, updateKycStatus } from "@/services/user/userService";
import { Transaction } from "@/services/transactions/types";
import StatisticsCards from "./dashboard/StatisticsCards";
import UsersTab from "./users/UsersTab";
import TransactionsTab from "./transactions/TransactionsTab";
import KycTab from "./kyc/KycTab";
import { ADMIN_EMAIL } from "./utils/constants";
import { supabase } from "@/integrations/supabase/client";

const AdminPanel = ({ currentAdmin }: { currentAdmin: any }) => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Function to fetch all data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch all profiles and transactions
      const profilesData = await getAllProfiles();
      const transactionsData = await getAllTransactions();
      
      setUsers(profilesData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load admin dashboard data."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    
    // Set up real-time listeners for profiles and transactions tables
    const profilesChannel = supabase
      .channel('admin-profiles-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles'
        }, 
        (payload) => {
          console.log('Profile change received:', payload);
          // Refresh data when a profile changes
          fetchAllData();
        }
      )
      .subscribe();
      
    const transactionsChannel = supabase
      .channel('admin-transactions-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions'
        }, 
        (payload) => {
          console.log('Transaction change received:', payload);
          // Refresh data when a transaction changes
          fetchAllData();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(transactionsChannel);
    };
  }, [toast]);

  const handleKycAction = async (userId: string, action: "approve" | "reject") => {
    try {
      const status = action === "approve" ? "approved" : "rejected";
      const success = await updateKycStatus(userId, status);
      
      if (success) {
        // Update the local state immediately before the real-time update arrives
        setUsers(
          users.map((user) => {
            if (user.id === userId) {
              return {
                ...user,
                kyc_status: status as KycStatus,
                updated_at: new Date().toISOString()
              };
            }
            return user;
          })
        );

        toast({
          title: `KYC ${action === "approve" ? "Approved" : "Rejected"}`,
          description: `User KYC has been ${
            action === "approve" ? "approved" : "rejected"
          } successfully.`,
        });
        
        return Promise.resolve();
      } else {
        toast({
          variant: "destructive",
          title: "Action Failed",
          description: `Failed to ${action} KYC. Please try again.`,
        });
        return Promise.reject(new Error(`Failed to ${action} KYC`));
      }
    } catch (error) {
      console.error(`Error in ${action} KYC:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `An error occurred while ${action === "approve" ? "approving" : "rejecting"} KYC.`,
      });
      return Promise.reject(error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.reference && transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
            onClick={fetchAllData} 
            className="bg-anonpay-primary hover:bg-anonpay-primary/90 text-white px-3 py-2 rounded-md text-sm"
          >
            Refresh Data
          </button>
        </div>
      </div>

      <StatisticsCards users={users} transactions={transactions} />

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search users, transactions, or references..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
            <TabsTrigger value="transactions">Transactions ({transactions.length})</TabsTrigger>
            <TabsTrigger value="kyc">
              KYC Verification ({users.filter(u => u.kyc_status === "pending").length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  Manage user accounts and view their details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UsersTab filteredUsers={filteredUsers} searchTerm={searchTerm} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>
                  View and manage all transactions on the platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionsTab filteredTransactions={filteredTransactions} searchTerm={searchTerm} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="kyc" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>KYC Verification</CardTitle>
                <CardDescription>
                  Review and approve or reject KYC submissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <KycTab 
                  filteredUsers={users.filter(user => user.kyc_status === "pending")}
                  handleKycAction={handleKycAction}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
