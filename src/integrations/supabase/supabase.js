import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and Key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

// Check for missing environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or API key is missing. Please check your environment variables.');
  throw new Error('Supabase URL or API key is missing.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Optionally log a message indicating that the Supabase client has been initialized
if (import.meta.env.MODE === 'production') {
  console.log('Supabase client initialized successfully.');
}
