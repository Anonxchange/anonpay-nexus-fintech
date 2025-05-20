
import { supabase } from "@/integrations/supabase/client";

// Interface for airtime request params
export interface AirtimeRequestParams {
  phone: string;
  network: string;
  amount: number;
}

// Interface for airtime API response
export interface AirtimeResponse {
  success: boolean;
  message: string;
  transaction?: any;
}

// Map provider ID to network code for API
export const mapProviderToNetwork = (provider: string): string => {
  switch (provider.toLowerCase()) {
    case 'mtn':
      return 'MTN';
    case 'airtel':
      return 'AIRTEL';
    case 'glo':
      return 'GLO';
    case '9mobile':
      return '9MOBILE';
    default:
      return provider.toUpperCase();
  }
};

// Function to handle airtime top-up
export const topUpAirtime = async (params: AirtimeRequestParams): Promise<AirtimeResponse> => {
  try {
    // In a real-world scenario, you would call your backend API or edge function here
    // Since we can't connect to a third-party API without an edge function, we'll simulate it
    
    // For demo purposes, simulate a successful transaction
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call delay
    
    // Log transaction to database
    const { error } = await supabase.from('transactions').insert({
      amount: params.amount,
      currency: 'NGN',
      type: 'vtu',
      payment_method: 'wallet',
      status: 'completed',
      details: {
        service_type: 'airtime',
        phone_number: params.phone,
        network: params.network
      }
    });
    
    if (error) throw new Error(error.message);
    
    return {
      success: true,
      message: `Successfully topped up ${params.amount} to ${params.phone} on ${params.network} network`,
      transaction: {
        reference: `VTU${Date.now()}`,
        amount: params.amount,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error: any) {
    console.error('VTU API Error:', error);
    return {
      success: false,
      message: error.message || 'Failed to process airtime top-up'
    };
  }
};
