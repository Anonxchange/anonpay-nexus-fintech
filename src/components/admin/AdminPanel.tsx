
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import StatusBadge from "../ui/StatusBadge";
import { KycStatus, Profile } from "../../types/auth";
import { BarChart, LineChart, PieChart } from "lucide-react";
import { getAllProfiles, getAllTransactions, updateKycStatus } from "@/services/user/userService";
import { Transaction } from "@/services/transactions/types";

// Define the admin email constant
export const ADMIN_EMAIL = "admin@anonpay.com";

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
        <Button variant="outline" onClick={() => window.location.href = "/"}>
          View Site
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {users.length > 0 ? `${users.filter(u => 
                new Date(u.created_at || '').getMonth() === new Date().getMonth()).length} new this month` : 'No users yet'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground">
              {transactions.length > 0 ? 
                `${transactions.filter(t => new Date(t.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length} in the last week` : 
                'No transactions yet'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending KYC Verifications
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((user) => user.kyc_status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requires your attention
            </p>
          </CardContent>
        </Card>
      </div>

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
                {filteredUsers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>KYC Status</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name || "Unnamed User"}</TableCell>
                          <TableCell>
                            <StatusBadge status={user.kyc_status || "not_submitted"} />
                          </TableCell>
                          <TableCell>₦{(user.wallet_balance || 0).toLocaleString()}</TableCell>
                          <TableCell>
                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    {searchTerm ? "No users match your search" : "No users found"}
                  </div>
                )}
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
                {filteredTransactions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">
                            {transaction.user_name || "Unknown User"}
                          </TableCell>
                          <TableCell>{transaction.type}</TableCell>
                          <TableCell>₦{transaction.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                transaction.status === "completed"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    {searchTerm ? "No transactions match your search" : "No transactions found"}
                  </div>
                )}
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
                {users.filter(user => 
                    user.kyc_status === "pending" || user.kyc_status === "rejected"
                  ).length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers
                        .filter(
                          (user) =>
                            user.kyc_status === "pending" ||
                            user.kyc_status === "rejected"
                        )
                        .map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name || "Unnamed User"}</TableCell>
                            <TableCell>
                              <StatusBadge status={user.kyc_status || "not_submitted"} />
                            </TableCell>
                            <TableCell>
                              {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : "Unknown"}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleKycAction(user.id, "approve")}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleKycAction(user.id, "reject")}
                                >
                                  Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No pending KYC submissions
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
