
import { supabase } from "@/integrations/supabase/client";

// Get current price of cryptocurrency in USD
export const getCryptoPrice = async (cryptoSymbol: string): Promise<number> => {
  try {
    // This would normally make an API call to a crypto price API
    // For demo purposes, return a fixed price
    const mockPrices: Record<string, number> = {
      'btc': 63500,
      'eth': 3400,
      'usdt': 1,
      'xrp': 0.58,
    };
    
    return mockPrices[cryptoSymbol.toLowerCase()] || 0;
  } catch (error) {
    console.error('Error fetching crypto price:', error);
    throw error;
  }
};

// Convert USD amount to Naira
export const convertUsdToNaira = (usdAmount: number): number => {
  // Fixed exchange rate for demo purposes
  const exchangeRate = 1500; // 1 USD = 1500 NGN
  return usdAmount * exchangeRate;
};

// Process a crypto transaction
export const processCryptoTransaction = async (
  userId: string,
  cryptoSymbol: string,
  cryptoAmount: number,
  transactionType: 'buy' | 'sell'
): Promise<{ success: boolean; message: string }> => {
  try {
    // Get current price
    const cryptoPrice = await getCryptoPrice(cryptoSymbol);
    
    // Calculate USD value
    const usdValue = cryptoAmount * cryptoPrice;
    
    // Convert to Naira
    const nairaValue = convertUsdToNaira(usdValue);
    
    // For demo purposes, we'll just log the transaction to the database
    const { error } = await supabase.from('transactions').insert({
      user_id: userId,
      amount: nairaValue,
      currency: 'NGN',
      type: transactionType === 'buy' ? 'crypto_purchase' : 'crypto_sale',
      payment_method: 'wallet',
      status: 'completed',
      details: {
        crypto_symbol: cryptoSymbol,
        crypto_amount: cryptoAmount,
        crypto_price_usd: cryptoPrice,
        usd_value: usdValue,
        naira_value: nairaValue,
      }
    });
    
    if (error) throw new Error(error.message);
    
    // Update wallet balance
    const { error: walletError } = await supabase.rpc(
      "update_wallet_balance",
      {
        user_id: userId,
        amount: transactionType === 'buy' ? -nairaValue : nairaValue,
        transaction_type: transactionType === 'buy' ? 'purchase' : 'sale',
        reference: `crypto:${transactionType}:${cryptoSymbol}:${cryptoAmount}`
      }
    );
    
    if (walletError) throw new Error(walletError.message);
    
    return {
      success: true,
      message: `Successfully ${transactionType === 'buy' ? 'purchased' : 'sold'} ${cryptoAmount} ${cryptoSymbol.toUpperCase()}`
    };
  } catch (error: any) {
    console.error('Error processing crypto transaction:', error);
    return {
      success: false,
      message: error.message || `Failed to ${transactionType} crypto`
    };
  }
};
