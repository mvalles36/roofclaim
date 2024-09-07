import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.jsx';
import {
  useCustomers,
  useCustomer,
  useAddCustomer,
  useUpdateCustomer,
  useDeleteCustomer
} from './hooks/useCustomer.js';

export {
  supabase,
  SupabaseAuthProvider,
  useSupabaseAuth,
  SupabaseAuthUI,
  useCustomers,
  useCustomer,
  useAddCustomer,
  useUpdateCustomer,
  useDeleteCustomer
};