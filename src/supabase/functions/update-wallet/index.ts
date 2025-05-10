
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UpdateWalletRequest {
  userId: string;
  amount: number;
  transaction_type: string;
  reference?: string;
  is_admin?: boolean;
  admin_id?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Get the JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token or user not found' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Parse the request body
    const { userId, amount, transaction_type, reference = '', is_admin = false, admin_id } = await req.json() as UpdateWalletRequest;
    
    // Validate the request
    if (!userId || amount === undefined || !transaction_type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // If this is an admin request, verify that the user is an admin
    if (is_admin && admin_id) {
      const { data: adminData, error: adminError } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', admin_id)
        .single();
      
      if (adminError || adminData?.role !== 'admin') {
        return new Response(
          JSON.stringify({ error: 'Unauthorized: Admin privileges required' }),
          { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    } else if (user.id !== userId) {
      // Regular users can only update their own wallet
      return new Response(
        JSON.stringify({ error: 'Unauthorized: You can only update your own wallet' }),
        { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Call the RPC function to update the wallet
    const { data, error } = await supabaseClient.rpc(
      'update_wallet_balance',
      {
        user_id: userId,
        amount: amount,
        transaction_type: transaction_type,
        reference: reference
      }
    );

    if (error) {
      console.error('Error updating wallet balance:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Create a notification for the user
    let notificationTitle: string;
    let notificationMessage: string;
    
    if (amount > 0) {
      notificationTitle = 'Wallet Credited';
      notificationMessage = `Your wallet has been credited with ₦${amount.toLocaleString()}.`;
    } else {
      notificationTitle = 'Wallet Debited';
      notificationMessage = `Your wallet has been debited with ₦${Math.abs(amount).toLocaleString()}.`;
    }
    
    await supabaseClient
      .from('notifications')
      .insert({
        user_id: userId,
        title: notificationTitle,
        message: notificationMessage,
        notification_type: 'transaction',
        action_link: '/dashboard?tab=history'
      });

    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Unhandled error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
