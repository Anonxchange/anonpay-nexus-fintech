
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Bitcoin, Ethereum } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getPaymentMethods, PaymentMethod } from "@/services/transactionService";

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DepositDialog: React.FC<DepositDialogProps> = ({ open, onOpenChange }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        const methods = await getPaymentMethods();
        setPaymentMethods(methods);
      } catch (error) {
        console.error("Failed to fetch payment methods:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load payment methods. Please try again later."
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (open) {
      fetchPaymentMethods();
    }
  }, [open, toast]);
  
  const getMethodByCurrency = (currency: string) => {
    return paymentMethods.find(method => method.currency.toLowerCase() === currency.toLowerCase());
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Address has been copied to your clipboard"
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deposit Crypto</DialogTitle>
          <DialogDescription>
            Send cryptocurrency to the address below. Once confirmed, your wallet will be credited with the NGN equivalent.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="btc" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="btc">
              <Bitcoin className="mr-2 h-4 w-4" />
              Bitcoin
            </TabsTrigger>
            <TabsTrigger value="eth">
              <Ethereum className="mr-2 h-4 w-4" />
              Ethereum
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="btc">
            <Card>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex justify-center">Loading...</div>
                ) : (
                  <>
                    <div className="flex flex-col items-center mb-4">
                      <div className="text-xs text-muted-foreground mb-2">Send BTC to this address:</div>
                      <div className="bg-muted p-3 rounded-md text-sm font-mono break-all">
                        {getMethodByCurrency("BTC")?.address || "Address not available"}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => copyToClipboard(getMethodByCurrency("BTC")?.address || "")}
                      >
                        Copy Address
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                      <p>• Your wallet will be credited once the transaction is confirmed</p>
                      <p>• The amount will be converted to NGN at the current rate</p>
                      <p>• Minimum deposit: 0.0001 BTC</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="eth">
            <Card>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex justify-center">Loading...</div>
                ) : (
                  <>
                    <div className="flex flex-col items-center mb-4">
                      <div className="text-xs text-muted-foreground mb-2">Send ETH to this address:</div>
                      <div className="bg-muted p-3 rounded-md text-sm font-mono break-all">
                        {getMethodByCurrency("ETH")?.address || "Address not available"}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => copyToClipboard(getMethodByCurrency("ETH")?.address || "")}
                      >
                        Copy Address
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                      <p>• Your wallet will be credited once the transaction is confirmed</p>
                      <p>• The amount will be converted to NGN at the current rate</p>
                      <p>• Minimum deposit: 0.01 ETH</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DepositDialog;
