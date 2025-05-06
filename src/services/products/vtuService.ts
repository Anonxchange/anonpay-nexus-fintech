
import { supabase } from "@/integrations/supabase/client";
import { VtuProduct, VtuProductVariant, EbillsVtuRequest, EbillsVtuResponse } from "./types";

// Mock data for VTU products
const mockVtuProducts: VtuProduct[] = [
  {
    id: "1",
    name: "MTN Airtime",
    description: "Top up your MTN line",
    provider: "MTN",
    imageUrl: "https://images.unsplash.com/photo-1595941069915-4ebc5197c14a?q=80&w=300&h=300&auto=format&fit=crop",
    isActive: true,
    category: "airtime",
    hasVariants: false,
    price: 0  // Variable price for airtime
  },
  {
    id: "2",
    name: "Airtel Airtime",
    description: "Top up your Airtel line",
    provider: "Airtel",
    imageUrl: "https://images.unsplash.com/photo-1535303311164-664fc9ec6532?q=80&w=300&h=300&auto=format&fit=crop",
    isActive: true,
    category: "airtime",
    hasVariants: false,
    price: 0  // Variable price for airtime
  },
  {
    id: "3",
    name: "MTN Data - 1GB",
    description: "1GB data valid for 30 days",
    provider: "MTN",
    imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=300&h=300&auto=format&fit=crop",
    isActive: true,
    category: "data",
    hasVariants: false,
    price: 1000
  },
  {
    id: "4",
    name: "Airtel Data - 1GB",
    description: "1GB data valid for 30 days",
    provider: "Airtel",
    imageUrl: "https://images.unsplash.com/photo-1557180295-76eee20ae8aa?q=80&w=300&h=300&auto=format&fit=crop",
    isActive: true,
    category: "data",
    hasVariants: false,
    price: 1000
  },
  {
    id: "5",
    name: "DSTV Subscription",
    description: "Pay for your DSTV subscription",
    provider: "DSTV",
    imageUrl: "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=300&h=300&auto=format&fit=crop",
    isActive: true,
    category: "cable",
    hasVariants: false,
    price: 7000
  }
];

// Get all VTU products
export const getVtuProducts = async (): Promise<VtuProduct[]> => {
  try {
    // In a real app, this would fetch from Supabase
    // For now, return mock data
    return mockVtuProducts;
  } catch (error) {
    console.error('Error fetching VTU products:', error);
    return [];
  }
};

// Get VTU products by category
export const getVtuProductsByCategory = async (category: string): Promise<VtuProduct[]> => {
  try {
    // In a real app, this would fetch from Supabase
    // For now, filter mock data
    return mockVtuProducts.filter(product => product.category === category);
  } catch (error) {
    console.error('Error fetching VTU products by category:', error);
    return [];
  }
};

// Buy VTU product
export const buyVtuProduct = async (
  userId: string, 
  productId: string, 
  amount: number,
  phoneNumber: string,
  provider: string
): Promise<boolean> => {
  try {
    // For airtime purchases, use the Ebills Africa API
    if (productId.includes("Airtime") || productId === "") {
      const networkCode = mapProviderToNetwork(provider);
      const response = await topUpAirtime({
        phone: phoneNumber,
        network: networkCode,
        amount: amount
      });
      
      if (response.success) {
        // Call Supabase RPC function to update wallet
        await supabase.rpc(
          "update_wallet_balance",
          {
            user_id: userId,
            amount: -amount, // negative amount for purchase
            transaction_type: "vtu-purchase",
            reference: `vtu:${provider}:airtime:${phoneNumber}`
          }
        );
        
        return true;
      }
      
      throw new Error(response.message || "VTU purchase failed");
    }
    
    // For other product types, use existing functionality
    const { data, error } = await supabase.rpc(
      "update_wallet_balance",
      {
        user_id: userId,
        amount: -amount, // negative amount for purchase
        transaction_type: "vtu-purchase",
        reference: `vtu:${productId}:${phoneNumber}`
      }
    );
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error buying VTU product:', error);
    throw error;
  }
};

// Integrate Ebills Africa API for airtime top-up
interface TopUpParams {
  phone: string;
  network: string;
  amount: number;
}

/**
 * Function to top up airtime using Ebills Africa API
 */
export const topUpAirtime = async ({ phone, network, amount }: TopUpParams): Promise<EbillsVtuResponse> => {
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
const mapProviderToNetwork = (providerId: string): string => {
  const networkMap: Record<string, string> = {
    "mtn": "MTN",
    "airtel": "AIRTEL",
    "glo": "GLO",
    "9mobile": "9MOBILE"
  };
  
  return networkMap[providerId.toLowerCase()] || providerId.toUpperCase();
};
