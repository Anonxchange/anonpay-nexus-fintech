
import { supabase } from "@/integrations/supabase/client";
import { GiftCard } from "./types";

// Get all gift cards - mocked since table doesn't exist yet
export const getGiftCards = async (): Promise<GiftCard[]> => {
  try {
    // Mock data instead of trying to fetch from a non-existent table
    const mockGiftCards: GiftCard[] = [
      {
        id: "1",
        name: "iTunes",
        description: "Apple iTunes Gift Card",
        buyRate: 650,
        sellRate: 700,
        imageUrl: "https://example.com/itunes.png",
        isActive: true,
        currency: "USD"
      },
      {
        id: "2",
        name: "Amazon",
        description: "Amazon.com Gift Card",
        buyRate: 700,
        sellRate: 750,
        imageUrl: "https://example.com/amazon.png",
        isActive: true,
        currency: "USD"
      },
      {
        id: "3",
        name: "Steam",
        description: "Steam Gaming Platform Gift Card",
        buyRate: 600,
        sellRate: 650,
        imageUrl: "https://example.com/steam.png",
        isActive: true,
        currency: "USD"
      }
    ];
    
    return mockGiftCards;
  } catch (error) {
    console.error('Error fetching gift cards:', error);
    return [];
  }
};

// Get gift card by ID - mocked
export const getGiftCardById = async (id: string): Promise<GiftCard | null> => {
  try {
    // Mock data
    const mockGiftCards = await getGiftCards();
    const card = mockGiftCards.find(card => card.id === id);
    
    if (!card) return null;
    
    return card;
  } catch (error) {
    console.error('Error fetching gift card:', error);
    return null;
  }
};

// Buy gift card
export const buyGiftCard = async (userId: string, cardId: string, amount: number): Promise<boolean> => {
  try {
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

// Submit gift card for selling - uses mock implementation
export const submitGiftCardForSale = async (
  userId: string, 
  cardId: string, 
  cardCode: string,
  amount: number,
  originalAmount: number,
  currency: string,
  additionalInfo: string = "",
  imageFile: File | null = null
): Promise<boolean> => {
  try {
    // Mock implementation for now
    console.log("Submitting gift card", {
      userId, cardId, cardCode, amount, originalAmount, currency, additionalInfo
    });
    
    // Mock successful submission
    return true;
  } catch (error) {
    console.error('Error submitting gift card:', error);
    return false;
  }
};

// Get user's gift card submissions - mocked
export const getUserGiftCardSubmissions = async (userId: string) => {
  try {
    // Mock data
    return [
      {
        id: "1",
        cardId: "1",
        cardName: "iTunes Gift Card",
        amount: 5000,
        originalAmount: 50,
        currency: "USD",
        status: "pending" as const,
        createdAt: new Date().toISOString(),
        imageUrl: "https://example.com/card-image1.jpg"
      },
      {
        id: "2",
        cardId: "3",
        cardName: "Steam Gift Card",
        amount: 3200,
        originalAmount: 20,
        currency: "USD",
        status: "approved" as const,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        imageUrl: "https://example.com/card-image2.jpg"
      }
    ];
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    return [];
  }
};
