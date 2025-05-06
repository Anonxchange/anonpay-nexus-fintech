
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const WithdrawalMethodTab = () => {
  const { toast } = useToast();
  const [methodType, setMethodType] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      // In a real app, we'd submit this to the backend
      // This is just a placeholder for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Withdrawal Method Added",
        description: "Your withdrawal method has been added successfully.",
      });
      
      // Reset form
      setMethodType("");
      const form = e.target as HTMLFormElement;
      form.reset();
    } catch (error) {
      console.error("Error adding withdrawal method:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add withdrawal method. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Withdrawal Method</CardTitle>
          <CardDescription>
            Add your preferred payment method for withdrawals
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="method-type">Method Type</Label>
              <Select 
                value={methodType} 
                onValueChange={setMethodType}
              >
                <SelectTrigger id="method-type">
                  <SelectValue placeholder="Select method type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="mobile_money">Mobile Money</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {methodType === "bank" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="bank-name">Bank Name</Label>
                  <Input id="bank-name" placeholder="Enter bank name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input id="account-number" placeholder="Enter account number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-name">Account Name</Label>
                  <Input id="account-name" placeholder="Enter account name" required />
                </div>
              </>
            )}
            
            {methodType === "paypal" && (
              <div className="space-y-2">
                <Label htmlFor="paypal-email">PayPal Email</Label>
                <Input id="paypal-email" type="email" placeholder="Enter PayPal email" required />
              </div>
            )}
            
            {methodType === "crypto" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="crypto-currency">Cryptocurrency</Label>
                  <Select>
                    <SelectTrigger id="crypto-currency">
                      <SelectValue placeholder="Select cryptocurrency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                      <SelectItem value="usdt">Tether (USDT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wallet-address">Wallet Address</Label>
                  <Input id="wallet-address" placeholder="Enter wallet address" required />
                </div>
              </>
            )}
            
            {methodType === "mobile_money" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="mobile-network">Mobile Network</Label>
                  <Input id="mobile-network" placeholder="Enter mobile network" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input id="phone-number" placeholder="Enter phone number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-name">Account Name</Label>
                  <Input id="account-name" placeholder="Enter account name" required />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading || !methodType}>
              {loading ? "Adding..." : "Add Withdrawal Method"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default WithdrawalMethodTab;
