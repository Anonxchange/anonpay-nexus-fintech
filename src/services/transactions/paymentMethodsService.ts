
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
    
    return (data || []) as PaymentMethod[];
  } catch (error) {
    console.error('Error in getPaymentMethods:', error);
    return [];
  }
};
