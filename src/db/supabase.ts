import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Anon key is public by design — Row-Level Security (see supabase/migrations)
// is what protects the data, not key secrecy.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Cloud sync is optional: with no env vars the app runs exactly as before,
// fully local. This lets the PWA work offline and pre-setup without crashing.
export const cloudEnabled = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = cloudEnabled
  ? createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;
