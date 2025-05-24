import { supabase } from "@/integrations/supabase/client";

// Renamed function to avoid conflicts with notifications
export const getUserActivityHistory = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching activity history:', error);
    return [];
  }
};

// Other activity service functions can be exported here
export const trackUserActivity = async (userId: string, action: string, details?: any) => {
  try {
    const { data, error } = await supabase
      .from('logs')
      .insert({
        user_id: userId,
        action,
        details
      });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error tracking user activity:', error);
    return null;
  }
};
