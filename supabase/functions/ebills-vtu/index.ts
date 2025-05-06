
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

    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      throw new Error("Invalid request body: " + error.message);
    }

    const { network, phone, amount } = requestBody;
    
    // Validate request data
    if (!network) {
      throw new Error("Missing required parameter: network");
    }
    if (!phone) {
      throw new Error("Missing required parameter: phone");
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      throw new Error("Invalid amount: Amount must be a positive number");
    }

    // Log the request we're about to make
    console.log("Making request to Ebills Africa API with:", { network, phone, amount });

    try {
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

      // Get response as text first to log it in case of JSON parsing errors
      const responseText = await response.text();
      
      // Log the raw response for debugging
      console.log("Ebills API raw response:", responseText);
      
      // Try to parse the response as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (error) {
        throw new Error(`Invalid JSON response from Ebills API: ${responseText}`);
      }
      
      // Log the parsed response
      console.log("Ebills API parsed response:", data);

      if (!response.ok) {
        throw new Error(data.message || `API returned error status ${response.status}: ${responseText}`);
      }

      // Check for API-specific error indications that might be in a 200 response
      if (data.error || data.status === "error" || data.status === "failed" || data.status === false) {
        throw new Error(data.message || data.error || "API returned error in response body");
      }

      return new Response(JSON.stringify({
        success: true,
        message: data.message || "VTU request processed successfully",
        data
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error while calling Ebills API:", error);
      throw new Error(`Ebills API request failed: ${error.message}`);
    }
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
