
import { MANUAL_NAIRA_RATE } from './types';

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
