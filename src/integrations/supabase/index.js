// Import all the relevant exports from other files in the supabase directory
import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.jsx';

// Export all the imported functions and objects from .auth and .hooks/
export {
  supabase, // Supabase client instance for interacting with your database
  SupabaseAuthProvider, // Provider component for managing authentication context
  useSupabaseAuth, // Custom hook to access authentication context
  SupabaseAuthUI, // Placeholder for authentication UI component
};
