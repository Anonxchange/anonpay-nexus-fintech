
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { GiftCard } from "@/services/products/types";
import { getGiftCards, buyGiftCard, sellGiftCard } from "@/services/products/giftcardService";
import { ArrowDownToLine, ArrowUpFromLine, Loader2, ArrowLeft } from "lucide-react";

interface GiftCardServiceProps {
  user: any;
}

const GiftCardService: React.FC<GiftCardServiceProps> = ({ user }) => {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
  const [amount, setAmount] = useState("");
  const [cardCode, setCardCode] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // Step 1: Select Card, Step 2: Enter Details
  const [currentMode, setCurrentMode] = useState<"buy" | "sell">("buy");
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadGiftCards = async () => {
      setLoading(true);
      try {
        const data = await getGiftCards();
        setGiftCards(data);
      } catch (error) {
        console.error("Failed to load gift cards:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load gift cards"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadGiftCards();
  }, [toast]);
  
  const handleModeChange = (mode: "buy" | "sell") => {
    setCurrentMode(mode);
    setCurrentStep(1);
    setSelectedCard(null);
    setAmount("");
    setCardCode("");
  };
  
  const handleCardSelect = (card: GiftCard) => {
    setSelectedCard(card);
    setCurrentStep(2);
  };
  
  const handleBackToCards = () => {
    setCurrentStep(1);
  };
  
  const handleBuy = async () => {
    if (!selectedCard) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a gift card"
      });
      return;
    }
    
    const buyAmount = parseFloat(amount);
    if (isNaN(buyAmount) || buyAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid amount"
      });
      return;
    }
    
    setProcessing(true);
    
    try {
      const nairaAmount = buyAmount * selectedCard.buyRate;
      const success = await buyGiftCard(user.id, selectedCard.id, nairaAmount);
      
      if (success) {
        toast({
          title: "Purchase Successful",
          description: `You have purchased ${buyAmount} USD of ${selectedCard.name}`,
        });
        setAmount("");
        setSelectedCard(null);
        setCurrentStep(1);
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Failed to buy gift card:", error);
      toast({
        variant: "destructive",
        title: "Purchase Failed",
        description: "Insufficient funds or network error"
      });
    } finally {
      setProcessing(false);
    }
  };
  
  const handleSell = async () => {
    if (!selectedCard) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a gift card"
      });
      return;
    }
    
    const sellAmount = parseFloat(amount);
    if (isNaN(sellAmount) || sellAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid amount"
      });
      return;
    }
    
    if (!cardCode) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter the gift card code"
      });
      return;
    }
    
    setProcessing(true);
    
    try {
      const nairaAmount = sellAmount * selectedCard.sellRate;
      const success = await sellGiftCard(user.id, selectedCard.id, nairaAmount, cardCode);
      
      if (success) {
        toast({
          title: "Sell Request Submitted",
          description: `Your request to sell ${sellAmount} USD of ${selectedCard.name} has been received and is pending approval`,
        });
        setAmount("");
        setCardCode("");
        setSelectedCard(null);
        setCurrentStep(1);
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Failed to sell gift card:", error);
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: "Network error or invalid gift card"
      });
    } finally {
      setProcessing(false);
    }
  };
  
  const renderCardSelection = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {loading ? (
        <div className="col-span-full text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading gift cards...</p>
        </div>
      ) : giftCards.length === 0 ? (
        <div className="col-span-full text-center py-8">
          No gift cards available at this time.
        </div>
      ) : (
        giftCards.map((card) => (
          <Card 
            key={card.id}
            className="cursor-pointer transition-all hover:shadow-md"
            onClick={() => handleCardSelect(card)}
          >
            <CardHeader className="py-3">
              <CardTitle className="text-lg">{card.name}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent className="py-0">
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {currentMode === "buy" ? "Buy Rate:" : "Sell Rate:"}
                </span>
                <span className="font-semibold">
                  ₦{currentMode === "buy" ? card.buyRate : card.sellRate}/$
                </span>
              </div>
            </CardContent>
            <CardFooter className="py-3">
              <Button 
                variant="outline" 
                className="w-full"
              >
                Select
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
  
  const renderBuyDetails = () => {
    if (!selectedCard) return null;
    
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackToCards}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div>
              <CardTitle>Buy {selectedCard.name}</CardTitle>
              <CardDescription>Enter the amount you want to buy</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="buy-amount">Amount (USD)</Label>
              <Input
                id="buy-amount"
                type="number"
                placeholder="25"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            
            {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && (
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>${parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate:</span>
                  <span>₦{selectedCard.buyRate}/$</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>₦{(parseFloat(amount) * selectedCard.buyRate).toLocaleString()}</span>
                </div>
              </div>
            )}
            
            <Button 
              className="w-full" 
              onClick={handleBuy}
              disabled={processing || !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0}
            >
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {processing ? "Processing..." : "Buy Now"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  const renderSellDetails = () => {
    if (!selectedCard) return null;
    
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackToCards}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div>
              <CardTitle>Sell {selectedCard.name}</CardTitle>
              <CardDescription>Enter your gift card details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sell-amount">Amount (USD)</Label>
              <Input
                id="sell-amount"
                type="number"
                placeholder="25"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="card-code">Gift Card Code</Label>
              <Input
                id="card-code"
                placeholder="Enter gift card code"
                value={cardCode}
                onChange={(e) => setCardCode(e.target.value)}
              />
            </div>
            
            {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && (
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>${parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate:</span>
                  <span>₦{selectedCard.sellRate}/$</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>You Get:</span>
                  <span>₦{(parseFloat(amount) * selectedCard.sellRate).toLocaleString()}</span>
                </div>
              </div>
            )}
            
            <Button 
              className="w-full" 
              onClick={handleSell}
              disabled={processing || !amount || !cardCode}
            >
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {processing ? "Processing..." : "Sell Gift Card"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gift Card Exchange</h1>
      
      <Tabs defaultValue="buy" onValueChange={(value) => handleModeChange(value as "buy" | "sell")}>
        <TabsList className="mb-4">
          <TabsTrigger value="buy">
            <ArrowDownToLine className="mr-2 h-4 w-4" />
            Buy Gift Cards
          </TabsTrigger>
          <TabsTrigger value="sell">
            <ArrowUpFromLine className="mr-2 h-4 w-4" />
            Sell Gift Cards
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="buy">
          {currentStep === 1 ? (
            renderCardSelection()
          ) : (
            renderBuyDetails()
          )}
        </TabsContent>
        
        <TabsContent value="sell">
          {currentStep === 1 ? (
            renderCardSelection()
          ) : (
            renderSellDetails()
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GiftCardService;
