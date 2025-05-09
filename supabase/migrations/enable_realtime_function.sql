
-- Create a function to enable realtime for tables
CREATE OR REPLACE FUNCTION public.enable_realtime_tables()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ""
AS $$
DECLARE
    result JSONB;
BEGIN
    -- Enable REPLICA IDENTITY FULL for tables to ensure complete row data
    EXECUTE 'ALTER TABLE public.profiles REPLICA IDENTITY FULL';
    EXECUTE 'ALTER TABLE public.transactions REPLICA IDENTITY FULL';
    EXECUTE 'ALTER TABLE public.kyc_submissions REPLICA IDENTITY FULL';
    EXECUTE 'ALTER TABLE public.notifications REPLICA IDENTITY FULL';
    EXECUTE 'ALTER TABLE public.wallets REPLICA IDENTITY FULL';
    EXECUTE 'ALTER TABLE public.giftcards REPLICA IDENTITY FULL';
    EXECUTE 'ALTER TABLE public.vtu_requests REPLICA IDENTITY FULL';
    EXECUTE 'ALTER TABLE public.crypto_trades REPLICA IDENTITY FULL';
    EXECUTE 'ALTER TABLE public.crypto_wallets REPLICA IDENTITY FULL';
    
    -- Add tables to realtime publication
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles';
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions';
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.kyc_submissions';
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications';
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.wallets';
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.giftcards';
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.vtu_requests';
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.crypto_trades';
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.crypto_wallets';
    
    SELECT jsonb_build_object(
        'success', true,
        'message', 'Realtime enabled for all tables'
    ) INTO result;
    
    RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.enable_realtime_tables() TO authenticated;
