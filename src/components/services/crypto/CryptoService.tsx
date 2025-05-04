
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bitcoin, Wallet, ArrowUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CryptoServiceProps {
  user: any;
}

const CryptoService: React.FC<CryptoServiceProps> = ({ user }) => {
  const [cryptoTab, setCryptoTab] = useState("buy");
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");

  const handleCryptoAction = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: `Crypto ${cryptoTab} request submitted`,
      description: `Your request to ${cryptoTab} ${amount} ${selectedCrypto} has been received and is being processed.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cryptocurrency Services</CardTitle>
        <CardDescription>Buy, sell, and manage your cryptocurrencies.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy" onValueChange={setCryptoTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="buy">Buy Crypto</TabsTrigger>
            <TabsTrigger value="sell">Sell Crypto</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buy" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="crypto-type">Select Cryptocurrency</Label>
                <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                    <SelectItem value="USDT">Tether (USDT)</SelectItem>
                    <SelectItem value="XRP">Ripple (XRP)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="amount">Amount to Buy</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    id="amount" 
                    type="number" 
                    placeholder="0.00" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <Button variant="outline" type="button" size="icon">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Button onClick={handleCryptoAction} className="w-full">
                <Wallet className="mr-2 h-4 w-4" />
                Buy {selectedCrypto}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="sell" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="crypto-type">Select Cryptocurrency</Label>
                <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                    <SelectItem value="USDT">Tether (USDT)</SelectItem>
                    <SelectItem value="XRP">Ripple (XRP)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="amount">Amount to Sell</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    id="amount" 
                    type="number" 
                    placeholder="0.00" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <Button variant="outline" type="button" size="icon">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Button onClick={handleCryptoAction} variant="destructive" className="w-full">
                <Bitcoin className="mr-2 h-4 w-4" />
                Sell {selectedCrypto}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CryptoService;
