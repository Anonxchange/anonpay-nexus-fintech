
import { supabase } from "@/integrations/supabase/client";

// Process deposit
export const processDeposit = async (
  userId: string,
  amount: number,
  reference: string
) => {
  try {
    // First, create the transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        amount: amount,
        type: "deposit",
        reference: reference,
        status: "completed"
      })
      .select()
      .single();
    
    if (transactionError) {
      throw new Error(`Failed to create transaction: ${transactionError.message}`);
    }
    
    // Then, update the wallet balance using the RPC function
    const { data, error } = await supabase.rpc(
      "update_wallet_balance",
      {
        user_id: userId,
        amount: amount,
        transaction_type: "deposit",
        reference: reference
      }
    );
    
    if (error) {
      throw new Error(`Failed to process deposit: ${error.message}`);
    }
    
    // Get the updated profile with new balance
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('wallet_balance')
      .eq('id', userId)
      .single();
      
    if (!profileError) {
      console.log("Updated wallet balance:", profileData.wallet_balance);
    }
    
    console.log("Deposit processed successfully:", data);
    return transaction;
  } catch (error) {
    console.error('Error in processDeposit:', error);
    throw error;
  }
};
