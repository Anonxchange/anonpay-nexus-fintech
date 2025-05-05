
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import { Gift, Bitcoin, Phone, Search } from "lucide-react";
import CryptoService from "./crypto/CryptoService";
import GiftCardService from "./giftcards/GiftCardService";
import VtuService from "./vtu/VtuService";
import RateCheckerService from "./ratechecker/RateCheckerService";

interface ServiceTabsProps {
  user: any;
  activeTab?: string;
}

const ServiceTabs: React.FC<ServiceTabsProps> = ({ user, activeTab }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname.split("/").pop() || "";
  const currentActiveTab = activeTab || (["crypto", "gift-cards", "vtu", "rate-checker"].includes(path) ? path : "crypto");

  const handleTabChange = (tab: string) => {
    navigate(`/services/${tab}`);
  };

  return (
    <Tabs value={currentActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="crypto" onClick={() => handleTabChange("crypto")}>
          <Bitcoin className="mr-2 h-4 w-4" />
          Crypto
        </TabsTrigger>
        <TabsTrigger value="gift-cards" onClick={() => handleTabChange("gift-cards")}>
          <Gift className="mr-2 h-4 w-4" />
          Gift Cards
        </TabsTrigger>
        <TabsTrigger value="vtu" onClick={() => handleTabChange("vtu")}>
          <Phone className="mr-2 h-4 w-4" />
          VTU
        </TabsTrigger>
        <TabsTrigger value="rate-checker" onClick={() => handleTabChange("rate-checker")}>
          <Search className="mr-2 h-4 w-4" />
          Rate Checker
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="crypto">
        <CryptoService user={user} />
      </TabsContent>
      
      <TabsContent value="gift-cards">
        <GiftCardService user={user} />
      </TabsContent>
      
      <TabsContent value="vtu">
        <VtuService user={user} />
      </TabsContent>
      
      <TabsContent value="rate-checker">
        <RateCheckerService user={user} />
      </TabsContent>
    </Tabs>
  );
};

export default ServiceTabs;
