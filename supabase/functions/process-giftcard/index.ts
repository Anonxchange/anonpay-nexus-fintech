
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProcessGiftcardRequest {
  submissionId: string;
  action: 'approve' | 'reject';
  adminId: string;
  adminNote?: string;
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
    const { submissionId, action, adminId, adminNote } = await req.json() as ProcessGiftcardRequest;
    
    // Validate the request
    if (!submissionId || !action || !adminId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Verify admin permissions
    const { data: adminData, error: adminError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', adminId)
      .single();
    
    if (adminError || adminData?.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin privileges required' }),
        { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Get the gift card submission
    const { data: submission, error: submissionError } = await supabaseClient
      .from('gift_card_submissions')
      .select('*, gift_cards(*)')
      .eq('id', submissionId)
      .single();

    if (submissionError || !submission) {
      return new Response(
        JSON.stringify({ error: 'Gift card submission not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Update submission status
    const { error: updateError } = await supabaseClient
      .from('gift_card_submissions')
      .update({
        status: action,
        admin_notes: adminNote,
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: `Failed to update submission: ${updateError.message}` }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // If approved, credit the user's wallet based on the buy rate
    if (action === 'approve') {
      const giftCard = submission.gift_cards;
      const buyRate = giftCard?.buy_rate || 0;
      const amount = submission.amount;
      const creditAmount = amount * buyRate;

      // Credit user wallet
      const { data, error } = await supabaseClient.rpc(
        'update_wallet_balance',
        {
          user_id: submission.user_id,
          amount: creditAmount,
          transaction_type: 'giftcard',
          reference: `giftcard:${submission.card_name}:${submission.id}`
        }
      );

      if (error) {
        console.error('Error crediting wallet:', error);
        return new Response(
          JSON.stringify({ error: `Failed to credit wallet: ${error.message}` }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    }

    // Create a notification for the user
    let notificationTitle: string;
    let notificationMessage: string;
    
    if (action === 'approve') {
      notificationTitle = 'Gift Card Approved';
      notificationMessage = `Your ${submission.card_name} gift card has been approved and your wallet has been credited.`;
    } else {
      notificationTitle = 'Gift Card Rejected';
      notificationMessage = adminNote 
        ? `Your ${submission.card_name} gift card was rejected. Reason: ${adminNote}`
        : `Your ${submission.card_name} gift card was rejected. Please check your submission or contact support.`;
    }
    
    await supabaseClient
      .from('notifications')
      .insert({
        user_id: submission.user_id,
        title: notificationTitle,
        message: notificationMessage,
        notification_type: 'giftcard',
        action_link: '/dashboard?tab=giftcard'
      });

    return new Response(
      JSON.stringify({ success: true, message: `Gift card submission ${action}d successfully` }),
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
