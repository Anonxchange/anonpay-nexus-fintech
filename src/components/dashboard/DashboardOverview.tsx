
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import DepositDialog from "./DepositDialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import TransactionHistory from "./TransactionHistory";
import SettingsPage from "../settings/SettingsPage";
import { supabase } from "@/integrations/supabase/client";
import DashboardContent from "./DashboardContent";

interface DashboardProps {
  user: any;
}

const DashboardOverview: React.FC<DashboardProps> = ({ user }) => {
  const [fundDialogOpen, setFundDialogOpen] = useState(false);
  const { toast } = useToast();
  const { profile, refreshProfile } = useAuth();
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          // Refresh profile data to get the latest wallet balance
          if (refreshProfile) {
            await refreshProfile();
          }
          
          if (profile && profile.wallet_balance !== undefined) {
            setWalletBalance(profile.wallet_balance);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load your dashboard data. Please refresh."
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchUserData();
    
    // Set up real-time listener for profile updates
    const channel = supabase
      .channel('public:profiles')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'profiles',
          filter: `id=eq.${user?.id}` 
        }, 
        (payload) => {
          console.log('Profile updated:', payload);
          if (payload.new && payload.new.wallet_balance !== undefined) {
            setWalletBalance(payload.new.wallet_balance);
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, profile, refreshProfile, toast]);
  
  // Function to handle fund wallet action
  const handleFundWallet = () => {
    setFundDialogOpen(true);
  };
  
  const handleViewAllTransactions = () => {
    document.querySelector('[value="history"]')?.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;
  }

  return (
    <>
      <Tabs defaultValue="wallet" className="w-full space-y-4">
        <TabsList>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="wallet" className="space-y-4">
          <DashboardContent 
            walletBalance={walletBalance} 
            onFundWallet={handleFundWallet}
            onViewAllTransactions={handleViewAllTransactions}
          />
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>A history of all your transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionHistory showViewAll={false} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <SettingsPage />
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
