
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import { processDeposit } from "@/services/transactions";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CryptoDepositForm from "../services/crypto/CryptoDepositForm";
import { supabase } from "@/integrations/supabase/client";

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const directDepositSchema = z.object({
  amount: z.number()
    .positive("Amount must be positive")
    .min(100, "Minimum deposit is ₦100"),
  reference: z.string().optional()
});

type DirectDepositValues = z.infer<typeof directDepositSchema>;

const DepositDialog: React.FC<DepositDialogProps> = ({ open, onOpenChange }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<DirectDepositValues>({
    resolver: zodResolver(directDepositSchema),
    defaultValues: {
      amount: 1000,
      reference: ""
    }
  });

  const onSubmit = async (values: DirectDepositValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to make a deposit"
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Reference ID for the transaction
      const reference = values.reference || `dep_${Date.now().toString().slice(-6)}`;
      
      // Process the deposit through the service which updates Supabase
      await processDeposit(user.id, values.amount, reference);
      
      toast({
        title: "Deposit Successful",
        description: `₦${values.amount.toLocaleString()} has been added to your wallet`
      });
      
      // Close the dialog
      onOpenChange(false);
      
      // Reset the form
      form.reset();
    } catch (error: any) {
      console.error("Deposit error:", error);
      toast({
        variant: "destructive",
        title: "Deposit Failed",
        description: error.message || "Failed to process your deposit"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
          <DialogDescription>
            Choose your preferred method to deposit funds into your wallet.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="direct" className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="direct">Direct</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
          </TabsList>
          
          <TabsContent value="direct" className="pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (₦)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="0.00" 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Optional reference" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isProcessing}>
                  {isProcessing ? "Processing..." : "Deposit Funds"}
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="crypto" className="pt-4">
            <CryptoDepositForm 
              user={user} 
              onSuccess={handleSuccess} 
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DepositDialog;
