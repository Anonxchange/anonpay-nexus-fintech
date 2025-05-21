
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { processCryptoDeposit } from "@/services/transactions";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import { Loader2 } from "lucide-react";

// Add onSuccess to the props interface
export interface CryptoDepositFormProps {
  onSuccess?: () => void;
}

const cryptoSchema = z.object({
  amount: z.number().min(10, "Minimum deposit is ₦10"),
  currency: z.string().min(1, "Please select a currency"),
  walletAddress: z.string().min(26, "Please enter a valid wallet address"),
  transactionHash: z.string().min(10, "Please enter a valid transaction hash"),
});

type CryptoFormValues = z.infer<typeof cryptoSchema>;

const CryptoDepositForm: React.FC<CryptoDepositFormProps> = ({ onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<CryptoFormValues>({
    resolver: zodResolver(cryptoSchema),
    defaultValues: {
      amount: 100,
      currency: "",
      walletAddress: "",
      transactionHash: "",
    },
  });

  const onSubmit = async (values: CryptoFormValues) => {
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
      await processCryptoDeposit(
        user.id, 
        values.amount, 
        values.currency, 
        values.walletAddress, 
        values.transactionHash
      );

      toast({
        title: "Deposit Initiated",
        description: `Your ${values.currency} deposit of ₦${values.amount.toLocaleString()} is being processed`
      });

      // Call onSuccess if it exists
      onSuccess?.();

      form.reset();
    } catch (error: any) {
      console.error("Crypto deposit error:", error);
      toast({
        variant: "destructive",
        title: "Deposit Failed",
        description: error.message || "Failed to process your crypto deposit"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
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
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  <SelectItem value="USDT">Tether (USDT)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="walletAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wallet Address</FormLabel>
              <FormControl>
                <Input placeholder="Your crypto wallet address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transactionHash"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Hash</FormLabel>
              <FormControl>
                <Input placeholder="Transaction hash" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isProcessing}>
          {isProcessing ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </span>
          ) : "Initiate Crypto Deposit"}
        </Button>
      </form>
    </Form>
  );
};

export default CryptoDepositForm;
