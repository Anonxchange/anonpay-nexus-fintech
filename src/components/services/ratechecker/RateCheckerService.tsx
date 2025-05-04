
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RateCheckerServiceProps {
  user: any;
}

// This would come from an API in a real application
const GIFT_CARD_RATES = {
  AMAZON: { USD: 645, GBP: 815, EUR: 690, CAD: 480, AUD: 435 },
  ITUNES: { USD: 650, GBP: 810, EUR: 685, CAD: 485, AUD: 430 },
  STEAM: { USD: 635, GBP: 800, EUR: 675, CAD: 475, AUD: 425 },
  GOOGLE: { USD: 630, GBP: 795, EUR: 670, CAD: 470, AUD: 420 },
  XBOX: { USD: 625, GBP: 790, EUR: 665, CAD: 465, AUD: 415 },
  PSN: { USD: 640, GBP: 805, EUR: 680, CAD: 475, AUD: 425 },
};

const RateCheckerService: React.FC<RateCheckerServiceProps> = ({ user }) => {
  const { toast } = useToast();
  const [selectedCard, setSelectedCard] = useState("AMAZON");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleCheckRate = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setShowResult(true);
    toast({
      title: "Rate checked successfully",
      description: "Current rates have been fetched and displayed.",
    });
  };

  const calculateValue = () => {
    const cardRate = GIFT_CARD_RATES[selectedCard as keyof typeof GIFT_CARD_RATES][selectedCurrency as keyof typeof GIFT_CARD_RATES.AMAZON];
    return parseFloat(amount) * cardRate;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gift Card Rate Checker</CardTitle>
        <CardDescription>Check current rates for gift cards and calculate values.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="card-type">Select Card Type</Label>
                <Select value={selectedCard} onValueChange={setSelectedCard}>
                  <SelectTrigger>
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
                <Label htmlFor="currency">Select Currency</Label>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                    <SelectItem value="AUD">AUD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
            
            <Button onClick={handleCheckRate} className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Check Rate
            </Button>
          </div>
          
          {showResult && (
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Rate Result</h3>
              
              <div className="grid gap-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Card Type:</span>
                  <span>{selectedCard.replace('_', ' ')}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Currency:</span>
                  <span>{selectedCurrency}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Rate (NGN):</span>
                  <span>₦{GIFT_CARD_RATES[selectedCard as keyof typeof GIFT_CARD_RATES][selectedCurrency as keyof typeof GIFT_CARD_RATES.AMAZON]}/1</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Card Value:</span>
                  <span>{selectedCurrency} {amount}</span>
                </div>
                
                <div className="flex justify-between py-2 font-bold text-lg">
                  <span>Total Value (NGN):</span>
                  <span>₦{calculateValue().toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Current Rates</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Card Type</TableHead>
                  <TableHead>USD</TableHead>
                  <TableHead>GBP</TableHead>
                  <TableHead>EUR</TableHead>
                  <TableHead>CAD</TableHead>
                  <TableHead>AUD</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(GIFT_CARD_RATES).map(([card, rates]) => (
                  <TableRow key={card}>
                    <TableCell className="font-medium">{card}</TableCell>
                    <TableCell>₦{rates.USD}</TableCell>
                    <TableCell>₦{rates.GBP}</TableCell>
                    <TableCell>₦{rates.EUR}</TableCell>
                    <TableCell>₦{rates.CAD}</TableCell>
                    <TableCell>₦{rates.AUD}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RateCheckerService;
