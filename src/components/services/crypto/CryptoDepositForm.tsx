import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { processCryptoDeposit } from "@/services/transactions";
import { generateReference } from "@/utils/general";

interface CryptoDepositFormProps {
  user: any;
}

const CryptoDepositForm: React.FC<CryptoDepositFormProps> = ({ user }) => {
  const [amount, setAmount] = useState<number | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<string>("BTC");
  const [reference, setReference] = useState<string>(generateReference("crypto-deposit"));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!amount || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid amount to deposit."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (!user?.id) {
        throw new Error("User ID is missing.");
      }
      
      await processCryptoDeposit(user.id, amount, selectedCrypto, reference);
      
      toast({
        title: "Deposit Initiated",
        description: "Your crypto deposit has been initiated successfully.",
      });
      
      // Reset form fields
      setAmount(null);
      setSelectedCrypto("BTC");
      setReference(generateReference("crypto-deposit"));
    } catch (error: any) {
      console.error("Crypto deposit failed:", error);
      toast({
        variant: "destructive",
        title: "Deposit Failed",
        description: error.message || "Failed to initiate crypto deposit. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Crypto Deposit</CardTitle>
        <CardDescription>Deposit crypto to your account.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount !== null ? amount.toString() : ""}
            onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : null)}
          />
        </div>
        <div>
          <Label htmlFor="crypto">Select Crypto</Label>
          <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
            <SelectTrigger id="crypto">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
              <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
              <SelectItem value="LTC">Litecoin (LTC)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="reference">Reference</Label>
          <Input
            id="reference"
            type="text"
            placeholder="Reference"
            value={reference}
            readOnly
          />
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Depositing..." : "Deposit"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CryptoDepositForm;
