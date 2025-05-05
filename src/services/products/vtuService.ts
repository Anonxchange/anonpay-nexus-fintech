
import { supabase } from "@/integrations/supabase/client";
import { VtuProduct } from "./types";

// Mock data for VTU products
const mockVtuProducts: VtuProduct[] = [
  {
    id: "1",
    name: "MTN Airtime",
    description: "Top up your MTN line",
    price: 0,  // Variable price
    imageUrl: "https://images.unsplash.com/photo-1595941069915-4ebc5197c14a?q=80&w=300&h=300&auto=format&fit=crop",
    isActive: true,
    category: "airtime"
  },
  {
    id: "2",
    name: "Airtel Airtime",
    description: "Top up your Airtel line",
    price: 0,  // Variable price
    imageUrl: "https://images.unsplash.com/photo-1535303311164-664fc9ec6532?q=80&w=300&h=300&auto=format&fit=crop",
    isActive: true,
    category: "airtime"
  },
  {
    id: "3",
    name: "MTN Data - 1GB",
    description: "1GB data valid for 30 days",
    price: 1000,
    imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=300&h=300&auto=format&fit=crop",
    isActive: true,
    category: "data"
  },
  {
    id: "4",
    name: "Airtel Data - 1GB",
    description: "1GB data valid for 30 days",
    price: 1000,
    imageUrl: "https://images.unsplash.com/photo-1557180295-76eee20ae8aa?q=80&w=300&h=300&auto=format&fit=crop",
    isActive: true,
    category: "data"
  },
  {
    id: "5",
    name: "DSTV Subscription",
    description: "Pay for your DSTV subscription",
    price: 7000,
    imageUrl: "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=300&h=300&auto=format&fit=crop",
    isActive: true,
    category: "cable"
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
