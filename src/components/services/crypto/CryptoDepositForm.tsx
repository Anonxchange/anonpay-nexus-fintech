
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { processCryptoDeposit } from "@/services/transactions/cryptoDepositService";
import { getCryptoPrice, convertUsdToNaira } from "@/services/transactions/cryptoService"; 
import { useToast } from "@/hooks/use-toast";
import { Copy, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface CryptoDepositFormProps {
  userId: string;
  onDepositComplete?: () => void;
}

const CryptoDepositForm: React.FC<CryptoDepositFormProps> = ({ userId, onDepositComplete }) => {
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");
  const [amount, setAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [nairaEquivalent, setNairaEquivalent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const { toast } = useToast();

  // Sample wallet addresses - in a production app, these would come from the database
  const walletAddresses = {
    bitcoin: "1PHTe7gp6g3bTwjnnFVDNKXUKUbX2aKbZj",
    ethereum: "0x95552dfa5af0c478c4c3198de99e7f66b5b2bc4e",
    usdt: "TKM5RmrEe9jLyT9ewn1q2pQsYBCHQqJs6H"
  };

  // Calculate Naira equivalent when crypto amount changes
  useEffect(() => {
    const calculateNairaValue = async () => {
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        setNairaEquivalent(0);
        return;
      }
      
      try {
        setCalculating(true);
        const cryptoPrice = await getCryptoPrice(selectedCrypto);
        const usdValue = parseFloat(amount) * cryptoPrice;
        const nairaValue = convertUsdToNaira(usdValue);
        setNairaEquivalent(nairaValue);
      } catch (error) {
        console.error("Failed to calculate conversion:", error);
      } finally {
        setCalculating(false);
      }
    };
    
    calculateNairaValue();
  }, [amount, selectedCrypto]);

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const handleCopyAddress = () => {
    const address = walletAddresses[selectedCrypto as keyof typeof walletAddresses];
    navigator.clipboard.writeText(address);
    toast({
      description: "Wallet address copied to clipboard",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !transactionHash || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Please enter a valid amount and transaction hash",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await processCryptoDeposit(
        userId,
        parseFloat(amount),
        selectedCrypto,
        transactionHash
      );
      
      toast({
        title: "Deposit successful",
        description: `Your deposit of ${formatNaira(nairaEquivalent)} has been processed`,
        variant: "default",
      });
      
      // Reset form
      setAmount("");
      setTransactionHash("");
      
      // Call the callback if it exists
      if (onDepositComplete) {
        onDepositComplete();
      }
    } catch (error: any) {
      console.error("Deposit failed:", error);
      toast({
        variant: "destructive",
        title: "Deposit failed",
        description: error.message || "Failed to process your deposit",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deposit Crypto</CardTitle>
        <CardDescription>Convert your cryptocurrency to naira</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="crypto">Select Cryptocurrency</Label>
              <Select
                value={selectedCrypto}
                onValueChange={setSelectedCrypto}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                  <SelectItem value="usdt">Tether (USDT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-md border">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Deposit Address</div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyAddress}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="mt-2 p-2 bg-white border rounded-md font-mono text-xs break-all">
                {walletAddresses[selectedCrypto as keyof typeof walletAddresses]}
              </div>
              <div className="mt-2 text-xs text-muted-foreground flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Send only {selectedCrypto.toUpperCase()} to this address
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  step="0.00000001"
                  min="0"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-20"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground uppercase">
                  {selectedCrypto === "bitcoin" ? "BTC" : selectedCrypto === "ethereum" ? "ETH" : "USDT"}
                </div>
              </div>
              <div className="text-sm text-right">
                ≈ {calculating ? "Calculating..." : formatNaira(nairaEquivalent)}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transactionHash">Transaction Hash</Label>
              <Input
                id="transactionHash"
                placeholder="Enter your transaction hash/ID"
                value={transactionHash}
                onChange={(e) => setTransactionHash(e.target.value)}
              />
              <div className="text-xs text-muted-foreground">
                Enter the transaction hash/ID from your crypto wallet after sending the funds
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full"
          disabled={loading || calculating || !amount || !transactionHash}
          onClick={handleSubmit}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Processing..." : "Confirm Deposit"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CryptoDepositForm;
