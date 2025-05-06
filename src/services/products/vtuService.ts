
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

// Buy VTU product with Ebills Africa API
export const buyVtuWithEbills = async (
  request: EbillsVtuRequest
): Promise<EbillsVtuResponse> => {
  try {
    console.log("Calling Ebills VTU function with:", request);
    
    // Validate request parameters before sending
    if (!request.network) {
      throw new Error("Network provider is required");
    }
    if (!request.phone || !/^\d{10,15}$/.test(request.phone.toString())) {
      throw new Error("Valid phone number is required (10-15 digits)");
    }
    if (!request.amount || isNaN(Number(request.amount)) || Number(request.amount) <= 0) {
      throw new Error("Amount must be a positive number");
    }

    // Call the Supabase Edge Function with retry logic
    let attempts = 0;
    const maxAttempts = 2;
    let lastError = null;
    
    while (attempts < maxAttempts) {
      try {
        const { data, error } = await supabase.functions.invoke('ebills-vtu', {
          body: request,
        });

        if (error) {
          console.error("Supabase function error:", error);
          lastError = error;
          // Try again
          attempts++;
          continue;
        }

        if (!data) {
          throw new Error('No data returned from VTU service');
        }

        // Additional validation of the function response
        if (!data.success) {
          throw new Error(data.message || 'VTU request failed');
        }

        console.log("Ebills VTU function response:", data);
        return data;
      } catch (error) {
        lastError = error;
        attempts++;
        if (attempts >= maxAttempts) {
          break;
        }
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // If we get here, all attempts failed
    throw lastError || new Error('Failed to process VTU request after multiple attempts');
    
  } catch (error: any) {
    console.error('Error buying VTU product with Ebills:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while processing your request',
    };
  }
};

// Buy VTU product
export const buyVtuProduct = async (
  userId: string, 
  productId: string, 
  amount: number,
  phoneNumber: string
): Promise<boolean> => {
  try {
    // In a real app, this would integrate with a VTU API
    // This is a simplified version
    
    // Call Supabase RPC function to update wallet
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
    return false;
  }
};
