
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { KycStatus, Profile } from "@/types/auth";
import { Transaction } from "@/services/transactions/types";
import UsersTab from "../users/UsersTab";
import TransactionsTab from "../transactions/TransactionsTab";
import KycTab from "../kyc/KycTab";
import RatesTab from "../rates/RatesTab";

interface AdminTabsProps {
  users: Profile[];
  transactions: Transaction[];
  handleKycAction: (userId: string, action: "approve" | "reject") => Promise<void>;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const AdminTabs: React.FC<AdminTabsProps> = ({ 
  users, 
  transactions,
  handleKycAction,
  activeTab = "users",
  onTabChange
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search users, transactions, or references..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
          <TabsTrigger value="transactions">Transactions ({transactions.length})</TabsTrigger>
          <TabsTrigger value="kyc">
            KYC Verification ({users.filter(u => u.kyc_status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="rates">Rates</TabsTrigger>
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
        <TabsContent value="rates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exchange Rates</CardTitle>
              <CardDescription>
                Manage platform exchange rates and conversion fees.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RatesTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTabs;
