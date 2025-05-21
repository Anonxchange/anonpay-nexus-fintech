
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAdminSubscriptions = (onDataChange: () => Promise<void>) => {
  const { toast } = useToast();

  useEffect(() => {
    console.log("Setting up admin realtime subscriptions...");
    
    // Set up real-time listeners for profiles and transactions tables
    const profilesChannel = supabase
      .channel('admin-profiles-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'user_profiles'
        }, 
        (payload) => {
          console.log('Profile change received:', payload);
          toast({
            title: "Profile Updated",
            description: `A user profile has been ${payload.eventType === 'INSERT' ? 'created' : 'updated'}.`,
            duration: 3000,
          });
          // Refresh data when a profile changes
          onDataChange();
        }
      )
      .subscribe((status) => {
        console.log(`Profiles channel status: ${status}`);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to profile changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Failed to subscribe to profile changes');
        }
      });
      
    const transactionsChannel = supabase
      .channel('admin-transactions-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions'
        }, 
        (payload) => {
          console.log('Transaction change received:', payload);
          toast({
            title: "Transaction Updated",
            description: `A transaction has been ${payload.eventType === 'INSERT' ? 'created' : 'updated'}.`,
            duration: 3000,
          });
          // Refresh data when a transaction changes
          onDataChange();
        }
      )
      .subscribe((status) => {
        console.log(`Transactions channel status: ${status}`);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to transaction changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Failed to subscribe to transaction changes');
        }
      });
    
    // Add listener for auth user changes as well
    const authChangesSubscription = supabase.auth.onAuthStateChange((event) => {
      if (['USER_UPDATED', 'SIGNED_IN', 'SIGNED_UP'].includes(event)) {
        // Refresh data when auth state changes that might affect user data
        console.log('Auth state changed:', event);
        onDataChange();
      }
    });
    
    return () => {
      console.log('Cleaning up admin subscriptions...');
      // Clean up subscriptions when component unmounts
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(transactionsChannel);
      authChangesSubscription.data.subscription.unsubscribe();
    };
  }, [onDataChange, toast]);
};
