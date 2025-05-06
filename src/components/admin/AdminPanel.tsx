
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { KycStatus, Profile } from "../../types/auth";
import { getAllProfiles, getAllTransactions, updateKycStatus } from "@/services/user/userService";
import { Transaction } from "@/services/transactions/types";
import StatisticsCards from "./dashboard/StatisticsCards";
import UsersTab from "./users/UsersTab";
import TransactionsTab from "./transactions/TransactionsTab";
import KycTab from "./kyc/KycTab";
import { ADMIN_EMAIL } from "./utils/constants";

const AdminPanel = ({ currentAdmin }: { currentAdmin: any }) => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, [toast]);

  const handleKycAction = async (userId: string, action: "approve" | "reject") => {
    try {
      const success = await updateKycStatus(userId, action === "approve" ? "approved" : "rejected");
      
      if (success) {
        // Update the local state
        setUsers(
          users.map((user) => {
            if (user.id === userId) {
              return {
                ...user,
                kyc_status: action === "approve" ? "approved" as KycStatus : "rejected" as KycStatus,
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
      } else {
        toast({
          variant: "destructive",
          title: "Action Failed",
          description: `Failed to ${action} KYC. Please try again.`,
        });
      }
    } catch (error) {
      console.error(`Error in ${action} KYC:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `An error occurred while ${action === "approve" ? "approving" : "rejecting"} KYC.`,
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading admin panel...</div>;
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
      </div>

      <StatisticsCards users={users} transactions={transactions} />

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search users or transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
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
                  filteredUsers={filteredUsers}
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
