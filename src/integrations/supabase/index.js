import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.js'; // Ensure the extension matches
import {
  useContacts as useAllContacts, // Renamed to avoid conflicts
  useContactsById,
  useAddContacts,
  useUpdateContacts,
  useDeleteContacts
} from './hooks/useContacts.js';

export {
  supabase,
  SupabaseAuthProvider,
  useSupabaseAuth,
  SupabaseAuthUI,
  useAllContacts, // Renamed to avoid conflicts
  useContactsById,
  useAddContacts,
  useUpdateContacts,
  useDeleteContacts
};
