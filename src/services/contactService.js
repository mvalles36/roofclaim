import { supabase } from '../integrations/supabase/supabase';

export const fetchContacts = async () => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*, users(name)')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createContact = async (contactData) => {
  const { data, error } = await supabase
    .from('contacts')
    .insert([contactData])
    .single();

  if (error) throw error;
  return data;
};

export const updateContact = async (id, contactData) => {
  const { data, error } = await supabase
    .from('contacts')
    .update(contactData)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const fetchActivities = async (contactId) => {
  const { data, error } = await supabase
    .from('activities')
    .select('*, steps(name, stages(name))')
    .eq('contact_id', contactId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createActivity = async (activityData) => {
  const { data, error } = await supabase
    .from('activities')
    .insert([activityData])
    .single();

  if (error) throw error;
  return data;
};