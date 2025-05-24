
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/hooks/use-toast";

// Generate a unique reference for transactions
const generateReference = () => {
  return 'CRYPTO_' + Math.random().toString(36).substring(2, 15).toUpperCase();
};

interface CryptoDepositFormProps {
  user?: any;
  onSuccess?: () => void;
}

const CryptoDepositForm: React.FC<CryptoDepositFormProps> = ({ user: propUser, onSuccess }) => {
  const { user: authUser } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>("");
  const [crypto, setCrypto] = useState<string>("bitcoin");
  const [loading, setLoading] = useState<boolean>(false);
  
  // Use the user from props if provided, otherwise use the one from auth context
  const user = propUser || authUser;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to continue",
        variant: "destructive"
      });
      return;
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const reference = generateReference();
      
      // Create transaction record
      const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        type: "crypto_deposit",
        amount: parseFloat(amount),
        status: "pending",
        reference: reference
      });
      
      if (error) throw error;
      
      toast({
        title: "Deposit initiated",
        description: `Your ${crypto} deposit of ${amount} has been initiated. Pending confirmation.`
      });
      
      // Reset form
      setAmount("");
      setCrypto("bitcoin");
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      console.error("Error creating crypto deposit:", error);
      toast({
        title: "Deposit failed",
        description: error.message || "Failed to process your deposit request",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="crypto">Select Cryptocurrency</Label>
            <Select value={crypto} onValueChange={setCrypto}>
              <SelectTrigger id="crypto">
                <SelectValue placeholder="Select cryptocurrency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                <SelectItem value="usdt">Tether (USDT)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="10"
            />
            <p className="text-xs text-muted-foreground">Minimum deposit: $10</p>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Continue to Payment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CryptoDepositForm;
