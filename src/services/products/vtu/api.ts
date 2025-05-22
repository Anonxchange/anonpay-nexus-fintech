
import { supabase } from "@/integrations/supabase/client";
import { mockVtuProducts, mockVtuProviders } from "./mockData";

// Function to fetch VTU providers
export const fetchVtuProviders = async () => {
  try {
    // Try to get real providers from Supabase
    const { data, error } = await supabase
      .from('vtu_providers')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw error;
    
    // Return real providers or fallback to mock
    return data?.length > 0 ? data : mockVtuProviders;
  } catch (error) {
    console.error("Error fetching VTU providers:", error);
    return mockVtuProviders; // Fallback to mock data
  }
};

// Function to fetch VTU products by provider and category
export const fetchVtuProducts = async (providerId: string, category: string) => {
  try {
    // Try to get real products from Supabase
    const { data, error } = await supabase
      .from('vtu_products')
      .select('*')
      .eq('provider_id', providerId)
      .eq('category', category)
      .eq('is_active', true);
    
    if (error) throw error;
    
    // Return real products or fallback to mock
    const filteredMockProducts = mockVtuProducts.filter(
      product => product.providerId === providerId && product.category === category
    );
    
    return data?.length ? data : filteredMockProducts;
  } catch (error) {
    console.error("Error fetching VTU products:", error);
    return mockVtuProducts.filter(
      product => product.providerId === providerId && product.category === category
    );
  }
};

// Process VTU purchase
export const processVtuPurchase = async (
  userId: string, 
  productId: string, 
  phoneNumber: string, 
  amount: number
) => {
  try {
    // Create transaction record
    const { data, error } = await supabase.from('transactions').insert({
      user_id: userId,
      amount: amount,
      type: 'vtu_purchase',
      reference: `VTU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'processing'
    }).select();
    
    if (error) throw error;
    
    // In a real app, here is where you would call the VTU provider's API
    // For now, simulate a successful purchase after a short delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (data && data.length > 0) {
      // Update transaction status to completed
      const { error: updateError } = await supabase
        .from('transactions')
        .update({ status: 'completed' })
        .eq('id', data[0].id);
      
      if (updateError) throw updateError;
      
      return { success: true, message: 'Purchase successful', transactionId: data[0].id };
    } else {
      throw new Error("Failed to create transaction");
    }
  } catch (error) {
    console.error('Error processing VTU purchase:', error);
    throw error;
  }
};

// Map provider ID to network code for airtime API
export const mapProviderToNetwork = (providerId: string): string => {
  const providerMap: Record<string, string> = {
    mtn: '01',
    airtel: '02',
    glo: '03',
    '9mobile': '04'
  };
  
  return providerMap[providerId] || '01'; // Default to MTN if not found
};

// Top up airtime function
export const topUpAirtime = async (
  params: { phone: string; network: string; amount: number }
): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    // This would normally call an external API
    // For now, simulate a successful airtime purchase
    console.log("Processing airtime purchase:", params);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return successful response
    return {
      success: true,
      message: `Successfully topped up ${params.phone} with ₦${params.amount}`,
      data: {
        reference: `AIR-${Date.now()}`
      }
    };
  } catch (error: any) {
    console.error("Error in airtime top-up:", error);
    return {
      success: false,
      message: error.message || "Failed to process airtime purchase"
    };
  }
};
