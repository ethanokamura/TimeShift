import { SupabaseAdapter } from "@auth/supabase-adapter";
 
// Create Supabase Adapter for AuthJS
export const supabaseAdapter = SupabaseAdapter({
  url: process.env.SUPABASE_URL!,
  secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
});

