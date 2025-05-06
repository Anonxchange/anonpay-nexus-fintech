
import { supabase } from "@/integrations/supabase/client";
import { GiftCard } from "./types";

// Get all gift cards
export const getGiftCards = async (): Promise<GiftCard[]> => {
  try {
    const { data, error } = await supabase
      .from('gift_cards')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    // Transform data to match our types
    return data.map(card => ({
      id: card.id,
      name: card.name,
      description: card.description,
      buyRate: card.buy_rate,
      sellRate: card.sell_rate,
      imageUrl: card.image_url,
      isActive: card.is_active,
      currency: card.currency
    }));
  } catch (error) {
    console.error('Error fetching gift cards:', error);
    return [];
  }
};

// Get gift card by ID
export const getGiftCardById = async (id: string): Promise<GiftCard | null> => {
  try {
    const { data, error } = await supabase
      .from('gift_cards')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Transform data to match our type
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      buyRate: data.buy_rate,
      sellRate: data.sell_rate,
      imageUrl: data.image_url,
      isActive: data.is_active,
      currency: data.currency
    };
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

// Submit gift card for selling
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
    // Upload image if provided
    let imageUrl = null;
    if (imageFile) {
      const fileName = `${userId}-${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('giftcards')
        .upload(fileName, imageFile);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('giftcards')
        .getPublicUrl(fileName);
        
      imageUrl = urlData.publicUrl;
    }
    
    // Create the submission
    const { error } = await supabase
      .from('gift_card_submissions')
      .insert({
        user_id: userId,
        card_id: cardId,
        card_code: cardCode,
        amount: amount,
        original_amount: originalAmount,
        currency: currency,
        additional_info: additionalInfo,
        image_url: imageUrl,
        status: 'pending'
      });
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error submitting gift card:', error);
    return false;
  }
};

// Get user's gift card submissions
export const getUserGiftCardSubmissions = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('gift_card_submissions')
      .select(`
        *,
        gift_cards:card_id (name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data.map(submission => ({
      id: submission.id,
      cardId: submission.card_id,
      cardName: submission.gift_cards?.name || 'Unknown Card',
      amount: submission.amount,
      originalAmount: submission.original_amount,
      currency: submission.currency,
      status: submission.status,
      createdAt: submission.created_at,
      imageUrl: submission.image_url
    }));
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    return [];
  }
};
