
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, ArrowDownToLine, ArrowUpFromLine, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DepositDialog from "./DepositDialog";
import WithdrawDialog from "./WithdrawDialog";

interface WalletManagementProps {
  user: any;
}

const WalletManagement: React.FC<WalletManagementProps> = ({ user }) => {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [depositDialogOpen, setDepositDialogOpen] = useState<boolean>(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchWalletBalance();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('wallet-updates')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'wallets',
          filter: `user_id=eq.${user?.id}` 
        }, 
        (payload) => {
          if (payload.new && payload.new.balance !== undefined) {
            setBalance(payload.new.balance);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchWalletBalance = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setBalance(data.balance || 0);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch wallet balance"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="mr-2 h-5 w-5" />
            My Wallet
          </CardTitle>
          <CardDescription>Manage your funds and transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Available Balance</div>
              <div className="text-3xl font-bold flex items-center">
                ₦{loading ? "Loading..." : balance.toLocaleString()}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={fetchWalletBalance} 
                  disabled={loading}
                  className="ml-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <Button 
                onClick={() => setDepositDialogOpen(true)}
                className="flex items-center"
              >
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                Deposit Funds
              </Button>
              
              <Button 
                onClick={() => setWithdrawDialogOpen(true)} 
                variant="outline"
                className="flex items-center"
              >
                <ArrowUpFromLine className="mr-2 h-4 w-4" />
                Withdraw Funds
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DepositDialog 
        open={depositDialogOpen} 
        onOpenChange={setDepositDialogOpen} 
      />
      
      <WithdrawDialog 
        open={withdrawDialogOpen} 
        onOpenChange={setWithdrawDialogOpen} 
      />
    </div>
  );
};

export default WalletManagement;
