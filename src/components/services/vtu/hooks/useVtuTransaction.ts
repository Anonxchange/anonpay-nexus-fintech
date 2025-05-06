
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { VtuProduct } from "@/services/products/types";
import { buyVtuProduct } from "@/services/products/vtuService";
import { TransactionStatusType } from "../types/vtuTypes";

export function useVtuTransaction(user: any) {
  const [processing, setProcessing] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatusType>({
    status: "idle",
    message: "",
  });
  
  const { toast } = useToast();
  
  const handleBuyTransaction = async (
    selectedProduct: VtuProduct | null,
    selectedProvider: string,
    phoneNumber: string,
    amount: string,
    category: string
  ) => {
    if (!selectedProvider) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a network provider"
      });
      return;
    }
    
    if (!phoneNumber) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a phone number"
      });
      return;
    }
    
    let buyAmount = selectedProduct?.price || 0;
    
    // For airtime, use user-input amount
    if (category === "airtime") {
      const inputAmount = parseFloat(amount);
      if (isNaN(inputAmount) || inputAmount < 100) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please enter a valid amount (minimum ₦100)"
        });
        return;
      }
      buyAmount = inputAmount;
    }
    
    setProcessing(true);
    setTransactionStatus({ status: "loading", message: "Processing your request..." });
    
    try {
      // Use mock purchase function
      const success = await buyVtuProduct(user.id, selectedProduct?.id || "", buyAmount, phoneNumber);
      
      if (success) {
        // Add delay to simulate API processing time
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setTransactionStatus({
          status: "success",
          message: `Your ${category} purchase was successful`
        });
        
        toast({
          title: "Purchase Successful",
          description: `Your ${category} purchase was successful`,
        });

        return true;
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error: any) {
      console.error("Failed to buy VTU product:", error);
      
      setTransactionStatus({
        status: "error",
        message: error.message || "Failed to complete your purchase. Please try again."
      });
      
      toast({
        variant: "destructive",
        title: "Purchase Failed",
        description: error.message || "Failed to complete your purchase. Please try again."
      });

      return false;
    } finally {
      setProcessing(false);
    }
  };

  return {
    processing,
    transactionStatus,
    handleBuyTransaction
  };
}
