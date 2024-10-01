import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or API key is missing. Please check your environment variables.');
  throw new Error('Supabase URL or API key is missing.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Log the API key (for debugging purposes only, remove in production)
if (import.meta.env.MODE === 'development') {
  console.log('Supabase API Key:', supabaseKey);
}
