
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabaseServiceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const adminClient = createClient(supabaseUrl, supabaseServiceRole);

// Helper to convert crypto amount to Naira
async function convertToNaira(cryptoAmount: number, cryptoCurrency: string) {
  const manualNairaRate = 1590; // Nigerian Naira to USD rate
  
  try {
    // Get crypto price in USD from CoinGecko
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoCurrency.toLowerCase()}&vs_currencies=usd`
    );
    
    if (!response.ok) {
      throw new Error(`CoinGecko API returned status: ${response.status}`);
    }
    
    const data = await response.json();
    const usdPrice = data[cryptoCurrency.toLowerCase()]?.usd || 0;
    
    // Calculate value in Naira
    const usdValue = cryptoAmount * usdPrice;
    const nairaValue = usdValue * manualNairaRate;
    
    return {
      usdValue,
      nairaValue
    };
  } catch (error) {
    console.error("Error fetching crypto price:", error);
    throw new Error("Failed to get cryptocurrency price");
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({
      error: "Method not allowed"
    }), {
      status: 405,
      headers: { 
        ...corsHeaders,
        "Content-Type": "application/json" 
      }
    });
  }
  
  try {
    // Parse the request body
    const { userId, amount, cryptoCurrency, transactionHash } = await req.json();
    
    if (!userId || !amount || !cryptoCurrency || !transactionHash) {
      return new Response(JSON.stringify({
        error: "Missing required parameters"
      }), {
        status: 400,
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        }
      });
    }
    
    // Verify the transaction hash (in a real application, this would verify the transaction on the blockchain)
    // For now, we'll assume it's valid
    
    // Convert crypto to Naira
    const { nairaValue } = await convertToNaira(amount, cryptoCurrency);
    
    // Update the wallet balance
    const { data, error } = await adminClient.rpc(
      "update_wallet_balance",
      {
        user_id: userId,
        amount: nairaValue,
        transaction_type: "deposit",
        reference: `${cryptoCurrency}:${transactionHash}`
      }
    );
    
    if (error) {
      throw error;
    }
    
    return new Response(JSON.stringify({
      success: true,
      data: {
        userId,
        amount: nairaValue,
        cryptoCurrency,
        transactionHash
      }
    }), {
      status: 200,
      headers: { 
        ...corsHeaders,
        "Content-Type": "application/json" 
      }
    });
    
  } catch (error) {
    console.error("Error processing deposit:", error);
    
    return new Response(JSON.stringify({
      error: error.message || "Failed to process deposit"
    }), {
      status: 500,
      headers: { 
        ...corsHeaders,
        "Content-Type": "application/json" 
      }
    });
  }
});
