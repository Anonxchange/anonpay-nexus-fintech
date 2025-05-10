
import { supabase } from "@/integrations/supabase/client";
import { GiftCard, GiftCardSubmission } from "./types";

// Get available gift cards
export const getGiftCards = async (): Promise<GiftCard[]> => {
  try {
    const { data, error } = await supabase
      .from('gift_cards')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) {
      console.error('Error fetching gift cards:', error);
      return [];
    }
    
    return data as GiftCard[];
  } catch (error) {
    console.error('Error in getGiftCards:', error);
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
    
    if (error) {
      console.error('Error fetching gift card:', error);
      return null;
    }
    
    return data as GiftCard;
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
    // First get the card details to include the name
    const { data: cardData, error: cardError } = await supabase
      .from('gift_cards')
      .select('name, currency')
      .eq('id', cardId)
      .single();
    
    if (cardError) {
      console.error('Error fetching gift card details:', cardError);
      return { success: false, message: 'Invalid gift card selected' };
    }
    
    // Create submission record
    const { data, error } = await supabase
      .from('gift_card_submissions')
      .insert({
        user_id: userId,
        card_id: cardId,
        card_name: cardData.name,
        card_code: cardCode,
        amount: amount,
        currency: cardData.currency,
        receipt_image_url: receipt_image_url,
        comments: comments,
        status: 'pending'
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Error submitting gift card:', error);
      return { success: false, message: `Failed to submit gift card: ${error.message}` };
    }
    
    // Create notification for user
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'Gift Card Submission Received',
        message: `Your ${cardData.name} gift card submission for ${amount} ${cardData.currency} is being processed.`,
        notification_type: 'giftcard',
        action_link: '/dashboard?tab=giftcard'
      });
    
    return { 
      success: true, 
      message: 'Gift card submitted successfully and is under review',
      submissionId: data.id
    };
  } catch (error: any) {
    console.error('Error in submitGiftCard:', error);
    return { success: false, message: error.message || 'An error occurred while submitting the gift card' };
  }
};

// Get user's gift card submissions
export const getUserGiftCardSubmissions = async (userId: string): Promise<GiftCardSubmission[]> => {
  try {
    const { data, error } = await supabase
      .from('gift_card_submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching gift card submissions:', error);
      return [];
    }
    
    return data as GiftCardSubmission[];
  } catch (error) {
    console.error('Error in getUserGiftCardSubmissions:', error);
    return [];
  }
};

// Get gift card submission by ID
export const getGiftCardSubmissionById = async (submissionId: string): Promise<GiftCardSubmission | null> => {
  try {
    const { data, error } = await supabase
      .from('gift_card_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();
    
    if (error) {
      console.error('Error fetching gift card submission:', error);
      return null;
    }
    
    return data as GiftCardSubmission;
  } catch (error) {
    console.error('Error in getGiftCardSubmissionById:', error);
    return null;
  }
};
