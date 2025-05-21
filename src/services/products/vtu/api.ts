
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
export const fetchVtuProducts = async (providerId, category) => {
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
    return data?.length > 0 ? data : mockVtuProducts.filter(
      product => product.provider_id === providerId && product.category === category
    );
  } catch (error) {
    console.error("Error fetching VTU products:", error);
    return mockVtuProducts.filter(
      product => product.provider_id === providerId && product.category === category
    );
  }
};

// Function to process VTU purchase
export const processVtuPurchase = async (userId, productId, phoneNumber, amount) => {
  try {
    // Create transaction record
    const { data, error } = await supabase.from('transactions').insert({
      user_id: userId,
      amount: amount,
      type: 'vtu_purchase',
      reference: `VTU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'processing'
    });
    
    if (error) throw error;
    
    // In a real app, here is where you would call the VTU provider's API
    // For now, simulate a successful purchase after a short delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update transaction status to completed
    const { error: updateError } = await supabase
      .from('transactions')
      .update({ status: 'completed' })
      .eq('id', data[0].id);
    
    if (updateError) throw updateError;
    
    return { success: true, message: 'Purchase successful', transactionId: data[0].id };
  } catch (error) {
    console.error('Error processing VTU purchase:', error);
    throw error;
  }
};
