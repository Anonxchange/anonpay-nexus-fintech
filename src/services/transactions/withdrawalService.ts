
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from './types';

// Process a withdrawal transaction
export const processWithdrawal = async (
  userId: string,
  amount: number,
  bankName: string,
  accountNumber: string,
): Promise<Transaction> => {
  try {
    // First, check if user has sufficient balance
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('balance')
      .eq('user_id', userId)
      .single();
    
    if (profileError) {
      throw new Error(profileError.message || "Could not retrieve user balance");
    }
    
    if (!profile || (profile.balance || 0) < amount) {
      throw new Error("Insufficient funds for this withdrawal");
    }
    
    // Create reference for the transaction
    const reference = `${bankName.substring(0, 3).toUpperCase()}${accountNumber.substring(-4)}`;
    
    // Call Supabase RPC function to update wallet balance (withdrawal is negative)
    const { data, error } = await supabase.rpc('update_wallet_balance', {
      user_id: userId,
      amount: amount,
      transaction_type: 'withdrawal',
      reference: reference
    });

    if (error) {
      console.error("Error in withdrawal transaction:", error);
      throw new Error(error.message || "Failed to process withdrawal");
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
    console.error("Process withdrawal error:", error);
    throw new Error(error.message || "Failed to process withdrawal");
  }
};

// Get user withdrawal history
export const getWithdrawalHistory = async (userId: string): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'withdrawal')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data as Transaction[];
  } catch (error: any) {
    console.error("Get withdrawal history error:", error);
    return [];
  }
};
