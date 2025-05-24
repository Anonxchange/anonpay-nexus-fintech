
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from './types';

// Process a deposit transaction
export const processDeposit = async (
  userId: string, 
  amount: number, 
  reference: string = ''
): Promise<Transaction> => {
  try {
    // Call Supabase RPC function to update wallet balance
    const { data, error } = await supabase.rpc('update_wallet_balance', {
      user_id: userId,
      amount: amount,
      transaction_type: 'deposit',
      reference: reference
    });

    if (error) {
      console.error("Error in deposit transaction:", error);
      throw new Error(error.message || "Failed to process deposit");
    }
    
    // Get the created transaction
    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', data)
      .single();
    
    if (fetchError) {
      throw new Error(fetchError.message);
    }
    
    return transaction as Transaction;
  } catch (error: any) {
    console.error("Process deposit error:", error);
    throw new Error(error.message || "Failed to process deposit");
  }
};
