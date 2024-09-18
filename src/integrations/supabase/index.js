import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.jsx';
import {
  useContacts,
  useContacts,
  useAddContacts,
  useUpdateContacts,
  useDeleteContacts
} from './hooks/useContacts.js';

export {
  supabase,
  SupabaseAuthProvider,
  useSupabaseAuth,
  SupabaseAuthUI,
  useContacts,
  useContacts,
  useAddContacts,
  useUpdateContacts,
  useDeleteContacts
};
