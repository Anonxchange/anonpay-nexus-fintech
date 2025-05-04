
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Manual Naira rate for crypto conversion
export const MANUAL_NAIRA_RATE = 1590;

// Transaction types
export type TransactionType = "deposit" | "withdrawal" | "fund";
export type TransactionStatus = "pending" | "completed" | "failed";

// Transaction interface
export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  reference?: string;
  status: TransactionStatus;
  created_at: string;
  updated_at?: string;
}

// Payment method interface
export interface PaymentMethod {
  id: string;
  method_type: string;
  currency: string;
  address: string;
}

// Fetch all payment methods
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('is_active', true);
    
    if (error) {
      throw new Error(`Error fetching payment methods: ${error.message}`);
    }
    
    return (data || []) as PaymentMethod[];
  } catch (error) {
    console.error('Error in getPaymentMethods:', error);
    return [];
  }
};

// Get crypto price in USD
export const getCryptoPrice = async (crypto: string) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd`
    );
    
    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }
    
    const data = await response.json();
    return data[crypto]?.usd || 0;
  } catch (error) {
    console.error("Failed to fetch crypto price:", error);
    return 0;
  }
};

// Convert USD to Naira
export const convertUsdToNaira = (usdAmount: number) => {
  return usdAmount * MANUAL_NAIRA_RATE;
};

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
