
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersTab from "../users/UsersTab";
import TransactionsTab from "../transactions/TransactionsTab";
import KycTab from "../kyc/KycTab";
import RatesTab from "../rates/RatesTab";
import GiftCardManagementTab from "../giftcards/GiftCardManagementTab";
import { useNavigate } from "react-router-dom";
import { Profile } from "@/types/auth";
import { KycAction } from "@/services/products/types"; // Update import to use from products/types
import { Transaction } from "@/services/transactions/types";

// Comment out these interfaces since they appear to conflict with the actual component props
// We'll let the components define their own prop interfaces
/*
interface UsersTabProps {
  users: Profile[];
}

interface TransactionsTabProps {
  transactions: Transaction[];
}

interface KycTabProps {
  users: Profile[];
  onAction: (userId: string, action: KycAction) => Promise<void>;
}
*/

interface AdminTabsProps {
  users: Profile[];
  transactions: Transaction[];
  handleKycAction: (userId: string, action: KycAction) => Promise<void>;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminTabs: React.FC<AdminTabsProps> = ({
  users, 
  transactions, 
  handleKycAction, 
  activeTab, 
  onTabChange
}) => {
  const navigate = useNavigate();

  const pendingKycCount = users.filter(user => user.kyc_status === 'pending').length;
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    onTabChange(value);
    navigate(`/admin?tab=${value}`);
  };

  return (
    <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
      <TabsList className="grid grid-cols-5 mb-6">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
        <TabsTrigger value="kyc" className="relative">
          KYC Verification
          {pendingKycCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {pendingKycCount}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="rates">Exchange Rates</TabsTrigger>
        <TabsTrigger value="giftcards">Gift Cards</TabsTrigger>
      </TabsList>

      <TabsContent value="users">
        <UsersTab users={users} />
      </TabsContent>

      <TabsContent value="transactions">
        <TransactionsTab transactions={transactions} />
      </TabsContent>

      <TabsContent value="kyc">
        <KycTab users={users.filter(user => user.kyc_status !== 'not_submitted')} onAction={handleKycAction} />
      </TabsContent>

      <TabsContent value="rates">
        <RatesTab />
      </TabsContent>

      <TabsContent value="giftcards">
        <GiftCardManagementTab />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
