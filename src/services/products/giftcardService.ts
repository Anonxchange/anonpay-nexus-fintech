
import { supabase } from "@/integrations/supabase/client";
import { GiftCard } from "./types";

// Mock data for gift cards
const mockGiftCards: GiftCard[] = [
  {
    id: "1",
    name: "Amazon Gift Card",
    description: "Available for US and UK stores",
    buyRate: 1020,
    sellRate: 950,
    imageUrl: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=300&h=300&auto=format&fit=crop",
    isActive: true
  },
  {
    id: "2",
    name: "iTunes Gift Card",
    description: "For App Store & iTunes purchases",
    buyRate: 1000,
    sellRate: 920,
    imageUrl: "https://images.unsplash.com/photo-1511370235399-1802cae1d32f?q=80&w=300&h=300&auto=format&fit=crop",
    isActive: true
  },
  {
    id: "3",
    name: "Google Play Gift Card",
    description: "For Google Play Store purchases",
    buyRate: 980,
    sellRate: 900,
    imageUrl: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?q=80&w=300&h=300&auto=format&fit=crop",
    isActive: true
  },
  {
    id: "4",
    name: "Steam Gift Card",
    description: "For Steam games and software",
    buyRate: 950,
    sellRate: 880,
    imageUrl: "https://images.unsplash.com/photo-1556438064-2d7646166914?q=80&w=300&h=300&auto=format&fit=crop",
    isActive: true
  }
];

// Get all gift cards
export const getGiftCards = async (): Promise<GiftCard[]> => {
  try {
    // In a real app, this would fetch from Supabase
    // const { data, error } = await supabase
    //   .from('gift_cards')
    //   .select('*')
    //   .eq('is_active', true);
    
    // if (error) throw error;
    // return data;
    
    // For now, return mock data
    return mockGiftCards;
  } catch (error) {
    console.error('Error fetching gift cards:', error);
    return [];
  }
};

// Get gift card by ID
export const getGiftCardById = async (id: string): Promise<GiftCard | null> => {
  try {
    // In a real app, this would fetch from Supabase
    // const { data, error } = await supabase
    //   .from('gift_cards')
    //   .select('*')
    //   .eq('id', id)
    //   .single();
    
    // if (error) throw error;
    // return data;
    
    // For now, return mock data
    const card = mockGiftCards.find(card => card.id === id);
    return card || null;
  } catch (error) {
    console.error('Error fetching gift card:', error);
    return null;
  }
};

// Buy gift card
export const buyGiftCard = async (userId: string, cardId: string, amount: number): Promise<boolean> => {
  try {
    // In a real app, this would update user's wallet and create a transaction
    // This is a simplified version
    
    // Call Supabase RPC function to update wallet
    const { data, error } = await supabase.rpc(
      "update_wallet_balance",
      {
        user_id: userId,
        amount: -amount, // negative amount for purchase
        transaction_type: "gift-card-purchase",
        reference: `gift-card:${cardId}`
      }
    );
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error buying gift card:', error);
    return false;
  }
};

// Sell gift card
export const sellGiftCard = async (
  userId: string, 
  cardId: string, 
  amount: number,
  cardCode: string,
  imageUrl?: string
): Promise<boolean> => {
  try {
    // In a real app, this would create a pending transaction
    // and notify admin for verification
    
    // Create a pending transaction
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        amount: amount, // positive amount for potential credit
        type: "gift-card-sell",
        reference: `gift-card-code:${cardCode}`,
        status: "pending" // Admin must approve
      });
    
    if (error) throw error;
    
    // In a real app, we would also upload the gift card image
    
    return true;
  } catch (error) {
    console.error('Error selling gift card:', error);
    return false;
  }
};
