
import { supabase } from "@/integrations/supabase/client";
import { GiftCard, GiftCardSubmission } from "./types";

// Get available gift cards
export const getGiftCards = async (): Promise<GiftCard[]> => {
  try {
    // Using dummy data for now since the table doesn't exist
    const dummyCards: GiftCard[] = [
      {
        id: "1",
        name: "iTunes Gift Card",
        description: "Apple iTunes Gift Card",
        buy_rate: 650,
        sell_rate: 700,
        image_url: "https://example.com/itunes.png",
        is_active: true,
        currency: "USD",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "2",
        name: "Amazon Gift Card",
        description: "Amazon.com Gift Card",
        buy_rate: 700,
        sell_rate: 750,
        image_url: "https://example.com/amazon.png",
        is_active: true,
        currency: "USD",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    return dummyCards;
  } catch (error) {
    console.error('Error in getGiftCards:', error);
    return [];
  }
};

// Get gift card by ID
export const getGiftCardById = async (id: string): Promise<GiftCard | null> => {
  try {
    // Dummy implementation
    const cards = await getGiftCards();
    const card = cards.find(card => card.id === id);
    return card || null;
  } catch (error) {
    console.error('Error in getGiftCardById:', error);
    return null;
  }
};

// Submit gift card for selling
export const submitGiftCard = async (
  userId: string,
  cardId: string,
  amount: number,
  cardCode: string,
  receipt_image_url: string,
  comments: string = ""
): Promise<{ success: boolean; message: string; submissionId?: string }> => {
  try {
    // Get the card details from dummy data
    const card = await getGiftCardById(cardId);
    
    if (!card) {
      return { success: false, message: 'Invalid gift card selected' };
    }
    
    // Dummy submission implementation
    const submissionId = `sub_${Date.now()}`;
    
    // In a real implementation, this would store in the database
    console.log("Submitting gift card:", {
      user_id: userId,
      card_id: cardId,
      card_name: card.name,
      card_code: cardCode,
      amount: amount,
      currency: card.currency,
      receipt_image_url: receipt_image_url,
      comments: comments,
      status: 'pending'
    });
    
    return { 
      success: true, 
      message: 'Gift card submitted successfully and is under review',
      submissionId: submissionId
    };
  } catch (error: any) {
    console.error('Error in submitGiftCard:', error);
    return { success: false, message: error.message || 'An error occurred while submitting the gift card' };
  }
};

// Get user's gift card submissions
export const getUserGiftCardSubmissions = async (userId: string): Promise<GiftCardSubmission[]> => {
  // Dummy implementation
  const dummySubmissions: GiftCardSubmission[] = [
    {
      id: "1",
      user_id: userId,
      user_name: "User",
      card_id: "1",
      card_name: "iTunes Gift Card",
      card_code: "ITNS-1234-5678",
      receipt_image_url: "https://example.com/receipt1.jpg",
      amount: 5000,
      currency: "USD",
      status: "pending",
      created_at: new Date().toISOString()
    },
    {
      id: "2",
      user_id: userId,
      card_id: "2",
      card_name: "Amazon Gift Card",
      card_code: "AMZN-9876-5432",
      receipt_image_url: "https://example.com/receipt2.jpg",
      amount: 3000,
      currency: "USD",
      status: "approved",
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ];
  
  return dummySubmissions;
};

// Get gift card submission by ID
export const getGiftCardSubmissionById = async (submissionId: string): Promise<GiftCardSubmission | null> => {
  // Dummy implementation
  const dummySubmissions = await getUserGiftCardSubmissions("user");
  const submission = dummySubmissions.find(s => s.id === submissionId);
  
  return submission || null;
};
