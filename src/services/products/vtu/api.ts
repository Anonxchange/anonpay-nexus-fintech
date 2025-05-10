
import { supabase } from "@/integrations/supabase/client";
import { EbillsTopUpResponse } from "../types";

// Integrate Ebills Africa API for airtime top-up
interface TopUpParams {
  phone: string;
  network: string;
  amount: number;
}

/**
 * Function to top up airtime using Ebills Africa API
 */
export const topUpAirtime = async ({ phone, network, amount }: TopUpParams): Promise<EbillsTopUpResponse> => {
  try {
    // 1. Authenticate and get JWT token
    const authRes = await fetch(
      "https://ebills.africa/wp-json/jwt-auth/v1/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "anonimoux007@gmail.com",
          password: "Mywork472$"
        })
      }
    );
    
    const authData = await authRes.json();
    if (!authData.token) {
      return {
        success: false,
        message: "Authentication failed: " + (authData.message || JSON.stringify(authData))
      };
    }

    // 2. VTU request with provided amount
    const vtuRes = await fetch(
      "https://ebills.africa/wp-json/ebills/v1/vtu",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authData.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone: phone,
          amount: amount,
          network: network
        })
      }
    );
    
    const vtuData = await vtuRes.json();
    if (!vtuRes.ok) {
      return {
        success: false,
        message: "VTU failed: " + (vtuData.message || JSON.stringify(vtuData))
      };
    }

    console.log("VTU Success:", vtuData);
    return {
      success: true,
      message: "Top-up successful",
      data: vtuData
    };
  } catch (err: any) {
    console.error("Error in topUpAirtime:", err);
    return {
      success: false,
      message: err.message || "An unknown error occurred"
    };
  }
};

// Map from provider ID to network code for Ebills API
export const mapProviderToNetwork = (providerId: string): string => {
  const networkMap: Record<string, string> = {
    "mtn": "MTN",
    "airtel": "AIRTEL",
    "glo": "GLO",
    "9mobile": "9MOBILE"
  };
  
  return networkMap[providerId.toLowerCase()] || providerId.toUpperCase();
};
