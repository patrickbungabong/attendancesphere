
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  return { data: null, error: error.message || 'An unexpected error occurred' };
};

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};
