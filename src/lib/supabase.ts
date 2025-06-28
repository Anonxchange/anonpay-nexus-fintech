
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ahhifmvhwwsguxbxqhfu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoaGlmbXZod3dzZ3V4YnhxaGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3ODYzMDksImV4cCI6MjA2MzM2MjMwOX0.pcIBds_rhACg-BVBE_rOX1zqgKQK9kWHkD7Cb1OCm50";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
