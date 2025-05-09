
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";
import { fetchUserNotifications } from "@/utils/supabaseHelpers";

export interface Activity {
  id: string;
  user_id: string;
  type: string;
  details: any;
  status: string;
  created_at: string;
  updated_at: string | null;
  activity_type: "transaction" | "kyc_submission" | "notification";
}

// Get user activity log
export const getUserActivityLog = async (adminId: string, userId: string): Promise<any[]> => {
  try {
    // First check if the user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', adminId)
      .single();

    // Safe access to role property
    const role = adminData?.role || 'user';

    if (adminError || role !== 'admin') {
      console.error('Error: Not authorized as admin', adminError);
      return [];
    }
    
    // Get all transactions for the user
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (transactionsError) {
      console.error('Error fetching user transactions:', transactionsError);
      return [];
    }
    
    // Fetch KYC submissions
    const { data: kycData, error: kycError } = await supabase
      .from('kyc_submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (kycError) {
      console.error('Error fetching KYC submissions:', kycError);
    }
    
    // Fetch notifications using the utility function that handles the RPC
    const notificationsData = await fetchUserNotifications(userId);
      
    // Combine all activities with appropriate type markers
    const allActivities = [
      ...(transactions || []).map(t => ({ ...t, activity_type: 'transaction' })),
      ...(kycData || []).map(k => ({ ...k, activity_type: 'kyc_submission' })),
      ...(notificationsData || []).map((n: Notification) => ({ 
        ...n, 
        activity_type: 'notification',
        type: n.notification_type || "general" 
      }))
    ];
    
    // Sort by created_at date - filter out any items that don't have a created_at date
    return allActivities
      .filter(a => a && a.created_at) 
      .sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  } catch (error) {
    console.error('Error in getUserActivityLog:', error);
    return [];
  }
};

// Enable realtime activity updates
export const setupActivitySubscription = (userId: string, callback: (activity: Activity) => void) => {
  if (!userId) return null;

  // Create a channel for realtime updates
  const channel = supabase
    .channel('activity-changes')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'transactions',
        filter: `user_id=eq.${userId}` 
      }, 
      (payload) => {
        console.log('Transaction change:', payload);
        if (payload.new) {
          callback({
            ...payload.new as any,
            activity_type: 'transaction'
          });
        }
      }
    )
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'kyc_submissions',
        filter: `user_id=eq.${userId}` 
      }, 
      (payload) => {
        console.log('KYC submission change:', payload);
        if (payload.new) {
          callback({
            ...payload.new as any,
            activity_type: 'kyc_submission'
          });
        }
      }
    )
    .subscribe();
    
  return channel;
};

// Create a new function to handle notifications channel separately
export const setupNotificationSubscription = (userId: string, callback: (activity: Activity) => void) => {
  if (!userId) return null;

  const channel = supabase
    .channel('notification-changes')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${userId}` 
      }, 
      (payload) => {
        console.log('Notification change:', payload);
        if (payload.new) {
          callback({
            ...payload.new as any,
            activity_type: 'notification',
            type: (payload.new as any).notification_type || "general"
          });
        }
      }
    )
    .subscribe();
    
  return channel;
};
