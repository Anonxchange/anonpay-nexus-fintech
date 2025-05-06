
import { VtuProduct } from "../types";
import { mockVtuProducts } from "./mockData";

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
