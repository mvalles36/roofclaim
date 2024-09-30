import { supabase } from '../integrations/supabase/supabase';

export const getContacts = async () => {
  const { data, error } = await supabase.from('contacts').select('*');
  if (error) throw error;
  return data;
};

export const createContact = async (newContact) => {
  const { data, error } = await supabase.from('contacts').insert([newContact]);
  if (error) throw error;
  return data;
};

export const updateContact = async (id, updates) => {
  const { data, error } = await supabase.from('contacts').update(updates).eq('id', id);
  if (error) throw error;
  return data;
};

