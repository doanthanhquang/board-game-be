/**
 * Supabase Configuration
 * Configuration for Supabase client (optional, for future use)
 */

export const supabaseConfig = {
  url: process.env.SUPABASE_URL || '',
  anonKey: process.env.SUPABASE_ANON_KEY || '',
};

/**
 * Check if Supabase client is configured
 */
export const isSupabaseClientConfigured = () => {
  return !!(supabaseConfig.url && supabaseConfig.anonKey);
};
