
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
