// Import all the relevant exports from other files in the supabase directory
import { createClient } from '@supabase/supabase-js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.jsx';

// Create and export the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export all the imported functions and objects
export {
  SupabaseAuthProvider, // Provider component for managing authentication context
  useSupabaseAuth, // Custom hook to access authentication context
  SupabaseAuthUI, // Placeholder for authentication UI component
};