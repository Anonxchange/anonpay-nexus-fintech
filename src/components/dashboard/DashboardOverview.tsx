import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WalletCard from "./WalletCard";
import { Profile } from "../../contexts/AuthContext";

interface DashboardProps {
  user: any;
}

const DashboardOverview: React.FC<DashboardProps> = ({ user }) => {
  return (
    <Tabs defaultValue="wallet" className="w-full space-y-4">
      <TabsList>
        <TabsTrigger value="wallet">Wallet</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="wallet" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Wallet Overview</CardTitle>
            <CardDescription>Your current wallet balance and recent transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <WalletCard user={user} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>A history of all your transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <p>No transactions yet.</p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <p>No settings available yet.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardOverview;
