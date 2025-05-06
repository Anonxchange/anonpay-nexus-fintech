
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/auth";
import { Transaction } from "../transactions/types";

// Get user profile data
export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data as Profile;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
};

// Get all profiles for admin view
export const getAllProfiles = async (): Promise<Profile[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching profiles:', error);
      return [];
    }
    
    return data as Profile[];
  } catch (error) {
    console.error('Error in getAllProfiles:', error);
    return [];
  }
};

// Get all transactions for admin view
export const getAllTransactions = async (): Promise<Transaction[]> => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, profiles(name)')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
    
    // Format the data to include user_name
    const formattedTransactions = data.map(transaction => ({
      ...transaction,
      user_name: transaction.profiles?.name || 'Unknown User'
    }));
    
    return formattedTransactions as Transaction[];
  } catch (error) {
    console.error('Error in getAllTransactions:', error);
    return [];
  }
};

// Update user KYC status
export const updateKycStatus = async (userId: string, status: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ kyc_status: status, updated_at: new Date().toISOString() })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating KYC status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateKycStatus:', error);
    return false;
  }
};
