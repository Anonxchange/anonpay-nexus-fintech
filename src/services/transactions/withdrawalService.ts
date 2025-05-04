
import { supabase } from "@/integrations/supabase/client";

// Process withdrawal
export const processWithdrawal = async (
  userId: string,
  amount: number,
  bank_name: string,
  account_number: string
) => {
  try {
    // First create a pending withdrawal transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        amount: -amount, // Negative for withdrawals
        type: "withdrawal",
        reference: `${bank_name}:${account_number}`,
        status: "pending"
      })
      .select()
      .single();

    if (transactionError) {
      throw new Error(`Failed to create withdrawal: ${transactionError.message}`);
    }

    // Attempt to make the Flutterwave API call
    try {
      const response = await fetch("https://api.flutterwave.com/v3/transfers", {
        method: "POST",
        headers: {
          "Authorization": "Bearer FLWSECK_TEST-d29b587a35bc20e4540be68e8c6dfa52-X",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          account_bank: bank_name,
          account_number: account_number,
          amount: amount,
          currency: "NGN",
          reference: `anonpay_withdrawal_${transaction.id}`,
          narration: "AnonPay Withdrawal"
        })
      });

      // Update withdrawal status based on response
      if (response.ok) {
        const flwResponse = await response.json();
        
        const { error: updateError } = await supabase
          .from('transactions')
          .update({
            status: "completed",
            reference: `${transaction.reference}:${flwResponse.data?.id || "unknown"}`
          })
          .eq("id", transaction.id);

        if (updateError) {
          console.error("Failed to update transaction status:", updateError);
        }

        // Also update the wallet balance using the RPC function
        const { error: balanceError } = await supabase.rpc(
          "update_wallet_balance",
          {
            user_id: userId,
            amount: -amount, // Negative for withdrawals
            transaction_type: "withdrawal",
            reference: transaction.reference
          }
        );

        if (balanceError) {
          console.error("Failed to update wallet balance:", balanceError);
        }

        return { success: true, data: transaction };
      } else {
        // Update transaction to failed
        const { error: updateError } = await supabase
          .from('transactions')
          .update({ status: "failed" })
          .eq("id", transaction.id);

        if (updateError) {
          console.error("Failed to update transaction status:", updateError);
        }

        const errorText = await response.text();
        throw new Error(`Flutterwave API error: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error("Withdrawal processing error:", error);
      
      // Make sure we update the transaction status to failed
      await supabase
        .from('transactions')
        .update({ status: "failed" })
        .eq("id", transaction.id);
        
      throw error;
    }
  } catch (error) {
    console.error('Error in processWithdrawal:', error);
    throw error;
  }
};
