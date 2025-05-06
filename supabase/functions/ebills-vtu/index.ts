
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get JWT token from environment variables (Supabase secrets)
    const jwtToken = Deno.env.get('EBILLS_AFRICA_JWT_TOKEN');
    
    if (!jwtToken) {
      throw new Error("JWT token is not configured in Supabase secrets. Please add EBILLS_AFRICA_JWT_TOKEN.");
    }

    const { network, phone, amount } = await req.json();
    
    // Validate request data
    if (!network || !phone || !amount) {
      throw new Error("Missing required parameters: network, phone, or amount");
    }

    console.log("Making request to Ebills Africa API with:", { network, phone, amount });

    // Make the request to Ebills Africa API
    const response = await fetch("https://ebills.africa/wp-json/ebills/v1/airtime", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        network,
        phone,
        amount: Number(amount)
      }),
    });

    const data = await response.json();
    
    // Log the response for debugging
    console.log("Ebills API response:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to process VTU request");
    }

    return new Response(JSON.stringify({
      success: true,
      message: data.message || "VTU request processed successfully",
      data
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing VTU request:", error);
    
    return new Response(JSON.stringify({
      success: false,
      message: error.message || "An error occurred while processing your request",
    }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
