
import { supabase } from "@/integrations/supabase/client";
import { GiftCard, GiftCardSubmission } from "./types";

// Get all available gift cards
export const getGiftCards = async (): Promise<GiftCard[]> => {
  try {
    // This is a temporary mock implementation since the table doesn't exist yet
    return [
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
    
    // In the real implementation, this would query the database:
    // const { data, error } = await supabase
    //   .from('gift_cards')
    //   .select('*')
    //   .eq('is_active', true);
    
    // if (error) throw error;
    // return data as GiftCard[];
  } catch (error) {
    console.error('Error fetching gift cards:', error);
    return [];
  }
};

// Get submissions for a specific user
export const getUserGiftCardSubmissions = async (userId: string): Promise<GiftCardSubmission[]> => {
  try {
    // This is a temporary mock implementation since the table doesn't exist yet
    return [
      {
        id: "1",
        user_id: userId,
        card_id: "1",
        card_name: "iTunes Gift Card",
        card_code: "ITUNES-1234-5678",
        receipt_image_url: "https://example.com/receipt.jpg",
        amount: 100,
        currency: "USD",
        status: "pending",
        created_at: new Date().toISOString()
      }
    ];
    
    // In the real implementation, this would query the database:
    // const { data, error } = await supabase
    //   .from('gift_card_submissions')
    //   .select('*')
    //   .eq('user_id', userId)
    //   .order('created_at', { ascending: false });
    
    // if (error) throw error;
    // return data as GiftCardSubmission[];
  } catch (error) {
    console.error('Error fetching gift card submissions:', error);
    return [];
  }
};

// Submit a new gift card for selling
export const submitGiftCard = async (
  userId: string,
  cardId: string,
  cardName: string,
  cardCode: string,
  amount: number,
  currency: string,
  receiptImageUrl: string,
  comments?: string
): Promise<{ success: boolean; message: string; submissionId?: string }> => {
  try {
    // This is a temporary mock implementation since the table doesn't exist yet
    return {
      success: true,
      message: "Gift card submitted successfully",
      submissionId: "mock-submission-id"
    };
    
    // In the real implementation, this would insert into the database:
    // const { data, error } = await supabase
    //   .from('gift_card_submissions')
    //   .insert({
    //     user_id: userId,
    //     card_id: cardId,
    //     card_name: cardName,
    //     card_code: cardCode,
    //     amount: amount,
    //     currency: currency,
    //     receipt_image_url: receiptImageUrl,
    //     comments: comments,
    //     status: 'pending'
    //   })
    //   .select('id')
    //   .single();
    
    // if (error) throw error;
    // return { 
    //   success: true, 
    //   message: "Gift card submitted successfully", 
    //   submissionId: data.id 
    // };
  } catch (error: any) {
    console.error('Error submitting gift card:', error);
    return { 
      success: false, 
      message: error.message || "Failed to submit gift card" 
    };
  }
};

// Update gift card rates
export const updateGiftCardRates = async (
  cardId: string, 
  buyRate: number, 
  sellRate: number, 
  isActive: boolean
): Promise<boolean> => {
  try {
    // This is a temporary mock implementation since the table doesn't exist yet
    return true;
    
    // In the real implementation, this would update the database:
    // const { error } = await supabase
    //   .from('gift_cards')
    //   .update({
    //     buy_rate: buyRate,
    //     sell_rate: sellRate,
    //     is_active: isActive,
    //     updated_at: new Date().toISOString()
    //   })
    //   .eq('id', cardId);
    
    // if (error) throw error;
    // return true;
  } catch (error) {
    console.error('Error updating gift card rates:', error);
    return false;
  }
};
