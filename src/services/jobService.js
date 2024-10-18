import { supabase } from '../integrations/supabase/supabase';

export const fetchJobs = async () => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*, contacts(name, email)')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createJob = async (jobData) => {
  const { data, error } = await supabase
    .from('jobs')
    .insert([jobData])
    .single();

  if (error) throw error;
  return data;
};

export const updateJob = async (id, jobData) => {
  const { data, error } = await supabase
    .from('jobs')
    .update(jobData)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};