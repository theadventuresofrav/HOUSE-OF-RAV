import { createClient } from '@supabase/supabase-js';

// Safe access to process.env to avoid ReferenceError in some browser environments
const getEnv = (key: string) => {
  try {
    return typeof process !== 'undefined' ? process.env[key] : undefined;
  } catch (e) {
    return undefined;
  }
};

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseKey = getEnv('SUPABASE_ANON_KEY');

export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey && supabaseUrl !== 'YOUR_SUPABASE_URL');

// If not configured, we create a dummy client or a client that will fail gracefully.
// However, to prevent runtime errors, we pass valid-looking dummy strings if missing,
// but the isSupabaseConfigured flag controls logic flow.
const safeUrl = supabaseUrl || 'https://placeholder.supabase.co';
const safeKey = supabaseKey || 'placeholder';

export const supabase = createClient(safeUrl, safeKey);