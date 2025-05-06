
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminSubscriptions = (onDataChange: () => Promise<void>) => {
  useEffect(() => {
    // Set up real-time listeners for profiles and transactions tables
    const profilesChannel = supabase
      .channel('admin-profiles-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles'
        }, 
        (payload) => {
          console.log('Profile change received:', payload);
          // Refresh data when a profile changes
          onDataChange();
        }
      )
      .subscribe();
      
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
          // Refresh data when a transaction changes
          onDataChange();
        }
      )
      .subscribe();
    
    // Add listener for auth user changes as well
    const authChangesSubscription = supabase.auth.onAuthStateChange((event) => {
      if (['USER_UPDATED', 'SIGNED_IN', 'SIGNED_UP'].includes(event)) {
        // Refresh data when auth state changes that might affect user data
        console.log('Auth state changed:', event);
        onDataChange();
      }
    });
    
    return () => {
      // Clean up subscriptions when component unmounts
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(transactionsChannel);
      authChangesSubscription.data.subscription.unsubscribe();
    };
  }, [onDataChange]);
};
