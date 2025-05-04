
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WalletCard from "./WalletCard";
import TransactionHistory from "./TransactionHistory";
import DepositDialog from "./DepositDialog";
import { Profile } from "../../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardProps {
  user: any;
}

const DashboardOverview: React.FC<DashboardProps> = ({ user }) => {
  const [fundDialogOpen, setFundDialogOpen] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuth();
  const [walletBalance, setWalletBalance] = useState(0);
  
  useEffect(() => {
    if (profile && profile.wallet_balance !== undefined) {
      setWalletBalance(profile.wallet_balance);
    }
  }, [profile]);
  
  // Function to handle fund wallet action
  const handleFundWallet = () => {
    setFundDialogOpen(true);
  };

  return (
    <>
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
              <WalletCard 
                balance={walletBalance} 
                onFund={handleFundWallet} 
              />
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
              <TransactionHistory />
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
      
      <DepositDialog 
        open={fundDialogOpen} 
        onOpenChange={setFundDialogOpen} 
      />
    </>
  );
};

export default DashboardOverview;
