// Import the Supabase client creation function from the Supabase JS library
import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase project URL and API key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

// Error handling if environment variables are missing
if (!supabaseUrl) {
  throw new Error('Supabase URL must be set in environment variables');
}

if (!supabaseKey) {
  throw new Error('Supabase API key must be set in environment variables');
}

// Log Supabase URL for development/debugging purposes (remove before production)
if (import.meta.env.MODE === 'development') {
  console.log('Supabase URL:', supabaseUrl);
}

// Create the Supabase client and export it for use across the application
export const supabase = createClient(supabaseUrl, supabaseKey);
