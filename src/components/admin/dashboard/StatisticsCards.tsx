
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Profile } from "@/types/auth";
import { Transaction } from "@/services/transactions/types";

interface StatisticsCardsProps {
  users: Profile[];
  transactions: Transaction[];
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ users, transactions }) => {
  return (
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
  );
};

export default StatisticsCards;
