
import { supabase } from "@/integrations/supabase/client";

// Process crypto deposit
export const processCryptoDeposit = async (
  userId: string,
  amount: number,
  currency: string,
  txHash: string
) => {
  try {
    // Create transaction record
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        amount: amount,
        type: "crypto_deposit",
        reference: txHash,
        status: "completed"
      })
      .select()
      .single();
    
    if (txError) {
      throw new Error(`Failed to create transaction: ${txError.message}`);
    }
    
    // Update wallet balance using RPC function
    const { data, error } = await supabase.rpc(
      "update_wallet_balance",
      {
        user_id: userId,
        amount: amount,
        transaction_type: "crypto_deposit",
        reference: txHash
      }
    );
    
    if (error) {
      throw new Error(`Failed to process crypto deposit: ${error.message}`);
    }
    
    console.log("Crypto deposit processed successfully:", data);
    return transaction;
  } catch (error) {
    console.error('Error processing crypto deposit:', error);
    throw error;
  }
};
