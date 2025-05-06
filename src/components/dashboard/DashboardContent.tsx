
import React from "react";
import WalletOverviewCard from "./WalletOverviewCard";
import QuickServices from "./QuickServices";
import RecentTransactionsCard from "./RecentTransactionsCard";

interface DashboardContentProps {
  walletBalance: number;
  onFundWallet: () => void;
  onViewAllTransactions: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  walletBalance, 
  onFundWallet,
  onViewAllTransactions
}) => {
  return (
    <div className="space-y-4">
      <WalletOverviewCard balance={walletBalance} onFund={onFundWallet} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickServices />
        <RecentTransactionsCard onViewAllClick={onViewAllTransactions} />
      </div>
    </div>
  );
};

export default DashboardContent;
