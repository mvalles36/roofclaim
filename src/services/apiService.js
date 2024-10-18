import { supabase } from '../integrations/supabase/supabase';

export const fetchContacts = async () => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*, users(name)')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const fetchJobs = async () => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*, contacts(name, email)')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const fetchDocuments = async () => {
  const { data, error } = await supabase
    .from('documents')
    .select('*, contacts(name)')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const fetchInvoices = async () => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, contacts(full_name), jobs(job_type)')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const fetchStages = async () => {
  const { data, error } = await supabase
    .from('stages')
    .select('*, steps(*)')
    .order('created_at', { ascending: true });
  
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

export const createActivity = async (activityData) => {
  const { data, error } = await supabase
    .from('activities')
    .insert([activityData])
    .single();

  if (error) throw error;
  return data;
};


export const fetchContactTasks = async (contactId) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('contact_id', contactId)
    .order('priority', { ascending: false })
    .order('due_date', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const fetchTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('priority', { ascending: false })
    .order('due_date', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const createTask = async (taskData) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([taskData])
    .single();

  if (error) throw error;
  return data;
};

export const updateTask = async ({ taskId, updates }) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .single();

  if (error) throw error;
  return data;
};

export const deleteTask = async (taskId) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) throw error;
};
