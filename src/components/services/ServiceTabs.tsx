
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { User } from "../../App";
import { AlertCircle } from "lucide-react";

interface ServiceTabsProps {
  user: User;
}

const ServiceTabs: React.FC<ServiceTabsProps> = ({ user }) => {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("crypto");
  
  // Exchange rates
  const cryptoRate = 1560; // ₦1560/$
  const giftCardBuyRate = 1050; // ₦1050/$
  const giftCardSellRate = 800; // ₦800/$
  
  // Check if user has completed KYC and is approved
  const isKycApproved = user.kycStatus === "approved";
  
  // Placeholder function to handle transactions
  const handleTransaction = (service: string, type: string, amount: number) => {
    if (user.walletBalance < amount) {
      toast({
        variant: "destructive",
        title: "Insufficient funds",
        description: "Please fund your wallet to continue.",
      });
      return;
    }
    
    toast({
      title: "Transaction submitted",
      description: `Your ${service} ${type} request has been submitted.`,
    });
  };

  const KycRequiredMessage = () => (
    <div className="bg-amber-50 border border-amber-200 p-4 rounded-md flex items-center gap-3 mb-4">
      <AlertCircle className="h-5 w-5 text-amber-600" />
      <div>
        <h4 className="font-medium text-amber-800">KYC Required</h4>
        <p className="text-sm text-amber-700">
          Complete your KYC verification to access this feature.
        </p>
      </div>
    </div>
  );
  
  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab}>
      <TabsList className="grid grid-cols-3 mb-8">
        <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
        <TabsTrigger value="giftcards">Gift Cards</TabsTrigger>
        <TabsTrigger value="vtu">VTU Services</TabsTrigger>
      </TabsList>
      
      {/* Crypto Tab */}
      <TabsContent value="crypto">
        {!isKycApproved ? (
          <KycRequiredMessage />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Buy Crypto</CardTitle>
                <CardDescription>
                  Purchase cryptocurrency using your wallet balance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="crypto-amount">Amount (USD)</Label>
                    <Input id="crypto-amount" type="number" placeholder="0.00" min="10" />
                    <p className="text-sm text-gray-500">
                      Rate: $1 = ₦{cryptoRate.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Crypto Type</Label>
                    <RadioGroup defaultValue="btc">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="btc" id="btc" />
                        <Label htmlFor="btc">Bitcoin (BTC)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="usdt" id="usdt" />
                        <Label htmlFor="usdt">Tether (USDT)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="crypto-wallet">Your Wallet Address</Label>
                    <Input id="crypto-wallet" placeholder="Enter your wallet address" />
                  </div>
                  
                  <div className="pt-2">
                    <Button className="w-full" onClick={() => handleTransaction("crypto", "buy", 100)}>
                      Buy Crypto
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sell Crypto</CardTitle>
                <CardDescription>
                  Sell your cryptocurrency for Naira
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sell-amount">Amount (USD)</Label>
                    <Input id="sell-amount" type="number" placeholder="0.00" min="10" />
                    <p className="text-sm text-gray-500">
                      Rate: $1 = ₦{cryptoRate.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Crypto Type</Label>
                    <RadioGroup defaultValue="btc">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="btc" id="sell-btc" />
                        <Label htmlFor="sell-btc">Bitcoin (BTC)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="usdt" id="sell-usdt" />
                        <Label htmlFor="sell-usdt">Tether (USDT)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="transaction-id">Transaction ID</Label>
                    <Input id="transaction-id" placeholder="Enter your transaction ID" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="screenshot">Upload Screenshot</Label>
                    <Input id="screenshot" type="file" accept="image/*" />
                    <p className="text-xs text-gray-500">Max 5MB (JPG, PNG)</p>
                  </div>
                  
                  <div className="pt-2">
                    <Button className="w-full" onClick={() => handleTransaction("crypto", "sell", 0)}>
                      Sell Crypto
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </TabsContent>
      
      {/* Gift Cards Tab */}
      <TabsContent value="giftcards">
        {!isKycApproved ? (
          <KycRequiredMessage />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Buy Gift Cards</CardTitle>
                <CardDescription>
                  Purchase gift cards using your wallet balance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="giftcard-type">Gift Card Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a gift card" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Popular Cards</SelectLabel>
                          <SelectItem value="amazon">Amazon</SelectItem>
                          <SelectItem value="itunes">iTunes</SelectItem>
                          <SelectItem value="steam">Steam</SelectItem>
                          <SelectItem value="google">Google Play</SelectItem>
                          <SelectItem value="playstation">PlayStation</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="giftcard-amount">Amount (USD)</Label>
                    <Input id="giftcard-amount" type="number" placeholder="0.00" min="10" />
                    <p className="text-sm text-gray-500">
                      Rate: $1 = ₦{giftCardBuyRate.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-delivery">Email for Delivery</Label>
                    <Input id="email-delivery" type="email" placeholder="you@example.com" />
                  </div>
                  
                  <div className="pt-2">
                    <Button className="w-full" onClick={() => handleTransaction("gift card", "buy", 100)}>
                      Buy Gift Card
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sell Gift Cards</CardTitle>
                <CardDescription>
                  Sell your gift cards for Naira
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sell-giftcard-type">Gift Card Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a gift card" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Popular Cards</SelectLabel>
                          <SelectItem value="amazon">Amazon</SelectItem>
                          <SelectItem value="itunes">iTunes</SelectItem>
                          <SelectItem value="steam">Steam</SelectItem>
                          <SelectItem value="google">Google Play</SelectItem>
                          <SelectItem value="playstation">PlayStation</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sell-giftcard-amount">Amount (USD)</Label>
                    <Input id="sell-giftcard-amount" type="number" placeholder="0.00" min="10" />
                    <p className="text-sm text-gray-500">
                      Rate: $1 = ₦{giftCardSellRate.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="card-code">Gift Card Code</Label>
                    <Input id="card-code" placeholder="Enter the gift card code" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="card-image">Upload Card Image</Label>
                    <Input id="card-image" type="file" accept="image/*" />
                    <p className="text-xs text-gray-500">Max 5MB (JPG, PNG)</p>
                  </div>
                  
                  <div className="pt-2">
                    <Button className="w-full" onClick={() => handleTransaction("gift card", "sell", 0)}>
                      Sell Gift Card
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </TabsContent>
      
      {/* VTU Services Tab */}
      <TabsContent value="vtu">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Airtime & Data</CardTitle>
              <CardDescription>
                Buy airtime and data bundles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="service-type">Service Type</Label>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="airtime-data" className="text-sm">Airtime</Label>
                      <Switch id="airtime-data" />
                      <Label htmlFor="airtime-data" className="text-sm">Data</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="network">Network Provider</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a network" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="mtn">MTN</SelectItem>
                        <SelectItem value="airtel">Airtel</SelectItem>
                        <SelectItem value="glo">Glo</SelectItem>
                        <SelectItem value="9mobile">9mobile</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input id="phone-number" placeholder="080xxxxxxxx" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="data-plan">Data Plan</Label>
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Select network first" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="1gb">1GB - ₦300</SelectItem>
                        <SelectItem value="2gb">2GB - ₦500</SelectItem>
                        <SelectItem value="5gb">5GB - ₦1,200</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vtu-amount">Amount</Label>
                  <Input id="vtu-amount" type="number" placeholder="0" min="100" />
                </div>
                
                <div className="pt-2">
                  <Button className="w-full" onClick={() => handleTransaction("airtime", "buy", 100)}>
                    Buy Now
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Utility Payments</CardTitle>
              <CardDescription>
                Pay bills and utilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bill-type">Bill Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bill type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>TV Subscriptions</SelectLabel>
                        <SelectItem value="dstv">DSTV</SelectItem>
                        <SelectItem value="gotv">GOtv</SelectItem>
                        <SelectItem value="startimes">StarTimes</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Electricity</SelectLabel>
                        <SelectItem value="ikeja">Ikeja Electric</SelectItem>
                        <SelectItem value="eko">Eko Electric</SelectItem>
                        <SelectItem value="phcn">PHCN</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="package">Select Package</Label>
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bill type first" />
                    </SelectTrigger>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer-id">Customer ID / IUC Number</Label>
                  <Input id="customer-id" placeholder="Enter your customer ID" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bill-amount">Amount</Label>
                  <Input id="bill-amount" type="number" placeholder="0" min="100" />
                </div>
                
                <div className="pt-2">
                  <Button className="w-full" onClick={() => handleTransaction("utility", "pay", 500)}>
                    Pay Now
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ServiceTabs;
