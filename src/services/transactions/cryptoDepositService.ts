
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
  transactionHash: string
) => {
  try {
    // Get the price of the cryptocurrency in USD
    const cryptoPrice = await getCryptoPrice(cryptoCurrency.toLowerCase());
    
    // Calculate USD value
    const usdValue = cryptoAmount * cryptoPrice;
    
    // Convert to Naira
    const nairaValue = convertUsdToNaira(usdValue);
    
    // Call the Supabase edge function to process the deposit
    const { data, error } = await supabase.functions.invoke('process-deposit', {
      body: {
        userId,
        amount: cryptoAmount,
        cryptoCurrency,
        transactionHash
      }
    });
    
    if (error) {
      throw new Error(`Failed to process crypto deposit: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error in processCryptoDeposit:', error);
    throw error;
  }
};
