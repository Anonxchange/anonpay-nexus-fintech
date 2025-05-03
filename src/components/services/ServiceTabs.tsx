import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { Wallet, Gift, Phone } from "lucide-react";
import { Profile } from "../../contexts/AuthContext";

interface ServiceTabsProps {
  user: any;
}

const ServiceTabs: React.FC<ServiceTabsProps> = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = location.pathname.split("/").pop();

  const handleTabChange = (tab: string) => {
    navigate(`/services/${tab}`);
  };

  return (
    <Tabs defaultValue={activeTab} className="w-full">
      <TabsList>
        <TabsTrigger value="crypto" onClick={() => handleTabChange("crypto")}>
          <Wallet className="mr-2 h-4 w-4" />
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
      </TabsList>
      <TabsContent value="crypto">
        <Card>
          <CardHeader>
            <CardTitle>Cryptocurrency Services</CardTitle>
            <CardDescription>Buy, sell, and manage your cryptocurrencies.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Coming soon...</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="gift-cards">
        <Card>
          <CardHeader>
            <CardTitle>Gift Card Services</CardTitle>
            <CardDescription>Trade your gift cards for cash or other assets.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Coming soon...</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="vtu">
        <Card>
          <CardHeader>
            <CardTitle>VTU Services</CardTitle>
            <CardDescription>Purchase airtime, data, and other virtual top-up services.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Coming soon...</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ServiceTabs;
