
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// The environment variables are automatically injected by Lovable
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  return { data: null, error: error.message || 'An unexpected error occurred' };
};
