
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth";
import DashboardOverview from "./DashboardOverview";
import CryptoService from "../services/crypto/CryptoService";
import VtuService from "../services/vtu/VtuService";
import GiftCardService from "../services/giftcards/GiftCardService";
import WalletManagement from "./WalletManagement";
import { Bitcoin, Gift, Phone, Wallet, CreditCard } from "lucide-react";

const DashboardTabs: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("overview");

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-5 mb-4">
        <TabsTrigger value="overview" className="flex items-center">
          <CreditCard className="mr-2 h-4 w-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="crypto" className="flex items-center">
          <Bitcoin className="mr-2 h-4 w-4" />
          Crypto
        </TabsTrigger>
        <TabsTrigger value="gift-cards" className="flex items-center">
          <Gift className="mr-2 h-4 w-4" />
          Gift Cards
        </TabsTrigger>
        <TabsTrigger value="vtu" className="flex items-center">
          <Phone className="mr-2 h-4 w-4" />
          VTU
        </TabsTrigger>
        <TabsTrigger value="wallet" className="flex items-center">
          <Wallet className="mr-2 h-4 w-4" />
          Wallet
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <DashboardOverview user={user} />
      </TabsContent>
      
      <TabsContent value="crypto">
        <CryptoService user={user} />
      </TabsContent>
      
      <TabsContent value="gift-cards">
        <GiftCardService user={user} />
      </TabsContent>
      
      <TabsContent value="vtu">
        <VtuService user={user} />
      </TabsContent>
      
      <TabsContent value="wallet">
        <WalletManagement user={user} />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
