
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from './types';

// Get user transactions
export const getUserTransactions = async (userId: string): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Error fetching transactions: ${error.message}`);
    }
    
    return (data || []) as Transaction[];
  } catch (error) {
    console.error('Error in getUserTransactions:', error);
    return [];
  }
};

// Create a new transaction
export const createTransaction = async (
  userId: string, 
  amount: number, 
  type: string, 
  reference: string = ''
): Promise<Transaction | null> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        amount: amount,
        type: type,
        reference: reference,
        status: 'completed'
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Error creating transaction: ${error.message}`);
    }
    
    // Update wallet balance
    const { error: balanceError } = await supabase.rpc('update_wallet_balance', {
      user_id: userId,
      amount: amount,
      transaction_type: type,
      reference: reference
    });
    
    if (balanceError) {
      console.error('Error updating wallet balance:', balanceError);
    }
    
    return data as Transaction;
  } catch (error) {
    console.error('Error in createTransaction:', error);
    return null;
  }
};

// Enable real-time updates for transactions table
export const enableRealtimeTransactions = () => {
  const channel = supabase
    .channel('public:transactions')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'transactions'
      }, 
      (payload) => {
        console.log('Transaction change received:', payload);
      }
    )
    .subscribe();
  
  return channel;
};
