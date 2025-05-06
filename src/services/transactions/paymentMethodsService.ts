
import { supabase } from "@/integrations/supabase/client";
import { PaymentMethod } from './types';

// Fetch all payment methods
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('is_active', true);
    
    if (error) {
      throw new Error(`Error fetching payment methods: ${error.message}`);
    }
    
    // Transform the data to match the PaymentMethod interface
    const formattedMethods = (data || []).map(method => ({
      id: method.id,
      name: method.method_type, // Using method_type as name
      type: method.method_type,
      icon: 'credit-card', // Default icon
      is_active: method.is_active,
      method_type: method.method_type,
      currency: method.currency,
      address: method.address
    }));
    
    return formattedMethods as PaymentMethod[];
  } catch (error) {
    console.error('Error in getPaymentMethods:', error);
    return [];
  }
};
