
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import WalletCard from "./WalletCard";
import TransactionHistory from "./TransactionHistory";
import DepositDialog from "./DepositDialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import { Link } from "react-router-dom";
import { Bitcoin, Gift, Phone, Search } from "lucide-react";
import SettingsPage from "../settings/SettingsPage";

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Quick Services</CardTitle>
                <CardDescription>Access our popular services</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Link to="/services/crypto">
                  <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                    <Bitcoin className="h-6 w-6" />
                    <span>Crypto</span>
                  </Button>
                </Link>
                <Link to="/services/gift-cards">
                  <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                    <Gift className="h-6 w-6" />
                    <span>Gift Cards</span>
                  </Button>
                </Link>
                <Link to="/services/vtu">
                  <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                    <Phone className="h-6 w-6" />
                    <span>VTU</span>
                  </Button>
                </Link>
                <Link to="/services/rate-checker">
                  <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                    <Search className="h-6 w-6" />
                    <span>Rate Checker</span>
                  </Button>
                </Link>
              </CardContent>
              <CardFooter>
                <Link to="/services" className="w-full">
                  <Button variant="secondary" className="w-full">View All Services</Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest activities</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] overflow-auto">
                <TransactionHistory limit={5} showViewAll={false} />
              </CardContent>
              <CardFooter>
                <Link to="/dashboard" className="w-full">
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => document.querySelector('[value="history"]')?.dispatchEvent(
                      new MouseEvent('click', { bubbles: true })
                    )}
                  >
                    View All Transactions
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
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
