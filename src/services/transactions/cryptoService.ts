
import { MANUAL_NAIRA_RATE } from './types';
import { supabase } from "@/integrations/supabase/client";

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

// Process a detected crypto deposit
export const processCryptoDeposit = async (
  userId: string,
  amount: number,
  currency: string,
  walletAddress: string,
  transactionHash: string
) => {
  try {
    // Get the price of the cryptocurrency in USD
    const cryptoPrice = await getCryptoPrice(currency.toLowerCase());
    
    // Calculate USD value
    const usdValue = amount * cryptoPrice;
    
    // Convert to Naira
    const nairaValue = convertUsdToNaira(usdValue);
    
    // Call the Supabase edge function to process the deposit
    const { data, error } = await supabase.functions.invoke('process-deposit', {
      body: {
        userId,
        amount: nairaValue, // Use the converted Naira value
        cryptoCurrency: currency,
        walletAddress,
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
