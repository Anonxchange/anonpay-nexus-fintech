
-- Enable realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;

-- Set REPLICA IDENTITY to FULL for the tables to ensure complete row data is available for change events
ALTER TABLE profiles REPLICA IDENTITY FULL;
ALTER TABLE transactions REPLICA IDENTITY FULL;

-- Ensure the profiles table has all required fields
DO $$
BEGIN
    -- Add account_status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'profiles' 
                  AND column_name = 'account_status') THEN
        ALTER TABLE profiles ADD COLUMN account_status TEXT DEFAULT 'active';
    END IF;
END$$;
