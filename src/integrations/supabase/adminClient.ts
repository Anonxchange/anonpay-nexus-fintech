
// This file contains a special Supabase client that uses the service role key
// It should ONLY be used in admin-protected routes and server-side functions
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://evtzcardsedazhxugntw.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2dHpjYXJkc2VkYXpoeHVnbnR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjI2NDA5MSwiZXhwIjoyMDYxODQwMDkxfQ.UAI4QiMRXytE95KKvO_Vi24ByVqKTAekkgzbZ_pQAUs";

// Import the admin client like this:
// import { supabaseAdmin } from "@/integrations/supabase/adminClient";
// IMPORTANT: Use this client ONLY in admin-related functionality

export const supabaseAdmin = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
