
import { supabase } from "@/integrations/supabase/client";
import { topUpAirtime, mapProviderToNetwork } from "./api";

// Buy VTU product
export const buyVtuProduct = async (
  userId: string, 
  productId: string, 
  amount: number,
  phoneNumber: string,
  provider: string
): Promise<boolean> => {
  try {
    // For airtime purchases, use the Ebills Africa API
    if (productId.includes("Airtime") || productId === "") {
      const networkCode = mapProviderToNetwork(provider);
      const response = await topUpAirtime({
        phone: phoneNumber,
        network: networkCode,
        amount: amount
      });
      
      if (response.success) {
        // Call Supabase RPC function to update wallet
        await supabase.rpc(
          "update_wallet_balance",
          {
            user_id: userId,
            amount: -amount, // negative amount for purchase
            transaction_type: "purchase", // Using a standard type that should be allowed
            reference: `vtu:${provider}:airtime:${phoneNumber}`
          }
        );
        
        return true;
      }
      
      throw new Error(response.message || "VTU purchase failed");
    }
    
    // For other product types, use existing functionality
    const { data, error } = await supabase.rpc(
      "update_wallet_balance",
      {
        user_id: userId,
        amount: -amount, // negative amount for purchase
        transaction_type: "purchase", // Using a standard type that should be allowed
        reference: `vtu:${productId}:${phoneNumber}`
      }
    );
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error buying VTU product:', error);
    throw error;
  }
};
