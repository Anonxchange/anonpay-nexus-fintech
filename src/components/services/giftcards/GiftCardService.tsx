
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gift, Upload, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GiftCardServiceProps {
  user: any;
}

const GiftCardService: React.FC<GiftCardServiceProps> = ({ user }) => {
  const [giftCardTab, setGiftCardTab] = useState("sell");
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [selectedCard, setSelectedCard] = useState("AMAZON");
  const [cardCode, setCardCode] = useState("");

  const handleGiftCardAction = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (giftCardTab === "sell" && !cardCode) {
      toast({
        title: "Card code required",
        description: "Please enter the gift card code",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: `Gift card ${giftCardTab} request submitted`,
      description: `Your request to ${giftCardTab} a ${selectedCard} gift card has been received and is being processed.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gift Card Services</CardTitle>
        <CardDescription>Trade your gift cards for cash or other assets.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sell" onValueChange={setGiftCardTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="sell">Sell Gift Card</TabsTrigger>
            <TabsTrigger value="buy">Buy Gift Card</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sell" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="card-type">Select Card Type</Label>
                <Select value={selectedCard} onValueChange={setSelectedCard}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Card Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AMAZON">Amazon</SelectItem>
                    <SelectItem value="ITUNES">iTunes</SelectItem>
                    <SelectItem value="STEAM">Steam</SelectItem>
                    <SelectItem value="GOOGLE">Google Play</SelectItem>
                    <SelectItem value="XBOX">Xbox</SelectItem>
                    <SelectItem value="PSN">PlayStation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="amount">Card Value</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="0.00" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="card-code">Card Code</Label>
                <Input 
                  id="card-code" 
                  type="text" 
                  placeholder="Enter gift card code" 
                  value={cardCode}
                  onChange={(e) => setCardCode(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="card-image">Upload Card Image (Optional)</Label>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="picture" className="cursor-pointer p-4 border-2 border-dashed rounded-lg text-center hover:bg-gray-50 flex flex-col items-center">
                    <Upload className="h-6 w-6 mb-2" />
                    <span>Click to upload</span>
                  </Label>
                  <Input id="picture" type="file" className="hidden" />
                </div>
              </div>
              
              <Button onClick={handleGiftCardAction} className="w-full">
                <Gift className="mr-2 h-4 w-4" />
                Sell Gift Card
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="buy" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="card-type">Select Card Type</Label>
                <Select value={selectedCard} onValueChange={setSelectedCard}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Card Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AMAZON">Amazon</SelectItem>
                    <SelectItem value="ITUNES">iTunes</SelectItem>
                    <SelectItem value="STEAM">Steam</SelectItem>
                    <SelectItem value="GOOGLE">Google Play</SelectItem>
                    <SelectItem value="XBOX">Xbox</SelectItem>
                    <SelectItem value="PSN">PlayStation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="amount">Card Value</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="0.00" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              
              <Button onClick={handleGiftCardAction} variant="secondary" className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                Buy Gift Card
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GiftCardService;
