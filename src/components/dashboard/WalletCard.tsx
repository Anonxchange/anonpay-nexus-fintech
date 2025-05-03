
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, Clock, Plus } from "lucide-react";

interface WalletCardProps {
  balance: number;
  onFund: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2
  }).format(amount);
};

const WalletCard: React.FC<WalletCardProps> = ({ balance, onFund }) => {
  return (
    <Card className="bg-gradient-to-br from-anonpay-primary to-anonpay-secondary text-white overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Wallet Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-4">{formatCurrency(balance)}</div>
        
        <div className="grid grid-cols-3 gap-2 text-white/80 text-xs">
          <div className="flex flex-col items-center bg-white/10 p-2 rounded-lg">
            <ArrowDownLeft className="h-4 w-4 mb-1" />
            <span>Deposit</span>
          </div>
          <div className="flex flex-col items-center bg-white/10 p-2 rounded-lg">
            <ArrowUpRight className="h-4 w-4 mb-1" />
            <span>Withdraw</span>
          </div>
          <div className="flex flex-col items-center bg-white/10 p-2 rounded-lg">
            <Clock className="h-4 w-4 mb-1" />
            <span>History</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          className="w-full bg-white text-anonpay-primary hover:bg-white/90" 
          onClick={onFund}
        >
          <Plus className="mr-1 h-4 w-4" /> Fund Wallet
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WalletCard;
