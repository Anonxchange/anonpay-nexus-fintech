
import { supabase } from "@/integrations/supabase/client";
import { AccountStatus } from "@/types/auth";

// Update user account status (admin only)
export const updateUserAccountStatus = async (
  adminId: string, 
  userId: string, 
  status: AccountStatus
): Promise<boolean> => {
  try {
    // First check if the user is an admin using the is_admin function
    const { data: isAdmin, error: adminError } = await supabase
      .rpc('is_admin', { user_id: adminId });

    if (adminError) {
      console.error('Error checking admin status:', adminError);
      throw new Error(`Admin verification error: ${adminError.message}`);
    }

    if (!isAdmin) {
      console.error('User is not an admin');
      throw new Error('Not authorized as admin');
    }
    
    // Update account status
    const { error } = await supabase
      .from('profiles')
      .update({ 
        account_status: status,
        updated_at: new Date().toISOString() 
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating user account status:', error);
      throw new Error(`Failed to update user status: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateUserAccountStatus:', error);
    throw error;
  }
};

// Set user as admin
export const setUserAsAdmin = async (userId: string): Promise<boolean> => {
  try {
    console.log(`Setting user ${userId} as admin...`);
    
    // First check if the profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (checkError) {
      if (checkError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log("Profile doesn't exist, creating new profile with admin role");
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            role: 'admin',
            wallet_balance: 0,
            kyc_status: 'not_submitted',
            account_status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (insertError) {
          console.error('Error creating admin profile:', insertError);
          throw new Error(`Failed to create admin profile: ${insertError.message}`);
        }
      } else {
        console.error('Error checking for existing profile:', checkError);
        throw new Error(`Failed to check existing profile: ${checkError.message}`);
      }
    } else {
      // Profile exists, update it
      console.log("Profile exists, updating role to admin");
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          role: 'admin',
          updated_at: new Date().toISOString() 
        })
        .eq('id', userId);
      
      if (updateError) {
        console.error('Error updating user role:', updateError);
        throw new Error(`Failed to update user role: ${updateError.message}`);
      }
    }
    
    console.log(`User ${userId} has been set as admin successfully`);
    return true;
  } catch (error: any) {
    console.error('Error in setUserAsAdmin:', error);
    throw error;
  }
};

// Check if a user account is active
export const checkAccountStatus = async (userId: string): Promise<AccountStatus | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('account_status')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error checking account status:', error);
      return null;
    }
    
    return data.account_status as AccountStatus;
  } catch (error) {
    console.error('Error in checkAccountStatus:', error);
    return null;
  }
};
