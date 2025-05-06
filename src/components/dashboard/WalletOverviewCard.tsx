
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WalletCard from "./WalletCard";

interface WalletOverviewCardProps {
  balance: number;
  onFund: () => void;
}

const WalletOverviewCard: React.FC<WalletOverviewCardProps> = ({ balance, onFund }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Overview</CardTitle>
        <CardDescription>Your current wallet balance and recent transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <WalletCard 
          balance={balance} 
          onFund={onFund} 
        />
      </CardContent>
    </Card>
  );
};

export default WalletOverviewCard;
