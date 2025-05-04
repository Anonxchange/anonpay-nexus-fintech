
import { supabase } from "@/integrations/supabase/client";

// Process deposit
export const processDeposit = async (
  userId: string,
  amount: number,
  reference: string
) => {
  try {
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
    
    return data;
  } catch (error) {
    console.error('Error in processDeposit:', error);
    throw error;
  }
};
