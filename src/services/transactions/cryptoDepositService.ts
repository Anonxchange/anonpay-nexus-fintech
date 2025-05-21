
import { supabase } from "@/integrations/supabase/client";
import { getCryptoPrice, convertUsdToNaira } from "./cryptoService";

// Process crypto deposit from wallet address
export const monitorCryptoDeposits = async (userId: string) => {
  try {
    // In a real application, this would connect to a blockchain API
    // For demo purposes, we'll simulate checking for deposits
    console.log("Monitoring crypto deposits for user:", userId);
    
    // This would be replaced with actual blockchain API calls
    return { 
      status: "monitoring",
      message: "Monitoring wallet for incoming transactions"
    };
  } catch (error) {
    console.error("Error monitoring crypto deposits:", error);
    throw error;
  }
};

// Process a detected crypto deposit
export const processCryptoDeposit = async (
  userId: string,
  cryptoAmount: number,
  cryptoCurrency: string,
  walletAddress: string,
  transactionHash: string
) => {
  try {
    // Get the price of the cryptocurrency in USD
    const cryptoPrice = await getCryptoPrice(cryptoCurrency.toLowerCase());
    
    // Calculate USD value
    const usdValue = cryptoAmount * cryptoPrice;
    
    // Convert to Naira
    const nairaValue = convertUsdToNaira(usdValue);
    
    // Create a transaction record
    const { data, error } = await supabase.from('transactions').insert({
      user_id: userId,
      amount: nairaValue,
      type: 'crypto_deposit',
      reference: `${cryptoCurrency}:${transactionHash}:${walletAddress}`,
      status: 'pending'
    }).select('id').single();
    
    if (error) throw new Error(`Failed to create transaction record: ${error.message}`);
    
    // In a real application, we would call the Supabase edge function to process the deposit
    // For now, we'll update the user's balance directly for demo purposes
    const { error: walletError } = await supabase.rpc(
      "update_wallet_balance",
      {
        user_id: userId,
        amount: nairaValue,
        transaction_type: "deposit",
        reference: `crypto_deposit:${cryptoCurrency}:${transactionHash}`
      }
    );
    
    if (walletError) throw new Error(`Failed to update wallet balance: ${walletError.message}`);
    
    return {
      success: true,
      transactionId: data?.id,
      amount: nairaValue,
      message: `${cryptoAmount} ${cryptoCurrency.toUpperCase()} deposit is being processed`
    };
  } catch (error: any) {
    console.error('Error in processCryptoDeposit:', error);
    throw new Error(error.message || 'Failed to process crypto deposit');
  }
};
