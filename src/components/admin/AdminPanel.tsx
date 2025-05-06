import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import StatusBadge from "../ui/StatusBadge";
import { KycStatus } from "../../types/auth";
import { BarChart, LineChart, PieChart } from "lucide-react";

// Define the admin email constant
export const ADMIN_EMAIL = "admin@anonpay.com";

interface User {
  id: string;
  name: string;
  email: string;
  kyc_status: KycStatus;
  wallet_balance: number;
  created_at: string;
}

interface Transaction {
  id: string;
  user_id: string;
  user_name: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
}

const AdminPanel = ({ currentAdmin }: { currentAdmin: any }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, we would fetch this data from an API
    // For demo purposes, we'll use mock data
    const mockUsers: User[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        kyc_status: "approved",
        wallet_balance: 5000,
        created_at: "2023-01-15T10:30:00Z",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        kyc_status: "pending",
        wallet_balance: 2500,
        created_at: "2023-02-20T14:45:00Z",
      },
      {
        id: "3",
        name: "Robert Johnson",
        email: "robert@example.com",
        kyc_status: "rejected",
        wallet_balance: 0,
        created_at: "2023-03-05T09:15:00Z",
      },
      {
        id: "4",
        name: "Sarah Williams",
        email: "sarah@example.com",
        kyc_status: "not_submitted",
        wallet_balance: 1000,
        created_at: "2023-03-10T16:20:00Z",
      },
    ];

    const mockTransactions: Transaction[] = [
      {
        id: "t1",
        user_id: "1",
        user_name: "John Doe",
        type: "Crypto Purchase",
        amount: 1000,
        status: "completed",
        created_at: "2023-03-01T10:30:00Z",
      },
      {
        id: "t2",
        user_id: "2",
        user_name: "Jane Smith",
        type: "Gift Card Sale",
        amount: 500,
        status: "completed",
        created_at: "2023-03-02T14:45:00Z",
      },
      {
        id: "t3",
        user_id: "1",
        user_name: "John Doe",
        type: "Withdrawal",
        amount: 2000,
        status: "pending",
        created_at: "2023-03-03T09:15:00Z",
      },
      {
        id: "t4",
        user_id: "3",
        user_name: "Robert Johnson",
        type: "Airtime Purchase",
        amount: 100,
        status: "completed",
        created_at: "2023-03-04T16:20:00Z",
      },
    ];

    setUsers(mockUsers);
    setTransactions(mockTransactions);
    setLoading(false);
  }, []);

  const handleKycAction = (userId: string, action: "approve" | "reject") => {
    // In a real app, we would make an API call to update the KYC status
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            kyc_status: action === "approve" ? "approved" : "rejected",
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
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading admin panel...</div>;
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
              +2 since last month
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
              +8 since last week
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>KYC Status</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <StatusBadge status={user.kyc_status} />
                        </TableCell>
                        <TableCell>₦{user.wallet_balance.toLocaleString()}</TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                          {transaction.user_name}
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
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
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <StatusBadge status={user.kyc_status} />
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
