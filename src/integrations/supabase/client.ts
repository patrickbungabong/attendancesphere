// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lkurvspcsokuffxdtarv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrdXJ2c3Bjc29rdWZmeGR0YXJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNzE4MjcsImV4cCI6MjA1Nzg0NzgyN30.T3NyNQ6AmcD5NVxBnqWpZbX7wb-cBQ-5pAPVS1J0lSc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);