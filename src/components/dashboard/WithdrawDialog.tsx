
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import { processWithdrawal } from "@/services/transactions";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const withdrawalSchema = z.object({
  bankName: z.string().min(2, "Bank name is required"),
  accountNumber: z.string().min(10, "Account number should be at least 10 characters"),
  amount: z.number()
    .positive("Amount must be positive")
    .min(500, "Minimum withdrawal is ₦500")
});

type WithdrawalFormValues = z.infer<typeof withdrawalSchema>;

const WithdrawDialog: React.FC<WithdrawDialogProps> = ({ open, onOpenChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, profile, refreshProfile } = useAuth();

  const form = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      bankName: "",
      accountNumber: "",
      amount: 0
    }
  });

  const onSubmit = async (values: WithdrawalFormValues) => {
    if (!user || !profile) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: "You must be logged in to make a withdrawal"
      });
      return;
    }
    
    if (values.amount > (profile.wallet_balance || 0)) {
      toast({
        variant: "destructive",
        title: "Insufficient funds",
        description: "Your wallet balance is insufficient for this withdrawal"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      await processWithdrawal(
        user.id, 
        values.amount, 
        values.bankName, 
        values.accountNumber
      );
      
      // Refresh profile to get updated wallet balance
      if (refreshProfile) {
        await refreshProfile();
      }
      
      toast({
        title: "Withdrawal initiated",
        description: "Your withdrawal request has been submitted"
      });
      
      onOpenChange(false);
    } catch (error: any) {
      console.error("Withdrawal error:", error);
      toast({
        variant: "destructive",
        title: "Withdrawal failed",
        description: error.message || "Failed to process withdrawal"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Enter your bank details to withdraw funds from your wallet.
            <div className="mt-1">
              Available balance: <strong>₦{profile?.wallet_balance?.toLocaleString() || 0}</strong>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your bank name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your account number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Withdraw Funds"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawDialog;
