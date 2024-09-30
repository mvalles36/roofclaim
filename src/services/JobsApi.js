import { supabase } from '../integrations/supabase/supabase';

export const createJob = async (newJob) => {
  const { data, error } = await supabase.from('jobs').insert([newJob]);
  if (error) throw error;
  return data;
};

export const getJobByContactId = async (contactId) => {
  const { data, error } = await supabase.from('jobs').select('*').eq('contact_id', contactId);
  if (error) throw error;
  return data;
};

