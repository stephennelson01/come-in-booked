import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Admin client using service role key - bypasses RLS
// Only use this for server-side operations where RLS needs to be bypassed
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn("Supabase admin credentials not configured");
    return null;
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
