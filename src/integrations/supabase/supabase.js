import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl) {
  throw new Error('Supabase URL must be set in environment variables');
}

if (!supabaseKey) {
  throw new Error('Supabase API key must be set in environment variables');
}

if (import.meta.env.MODE === 'development') {
  console.log('Supabase URL:', supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
