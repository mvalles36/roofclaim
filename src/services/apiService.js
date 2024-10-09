import { createSupabaseClient } from '../integrations/supabase/supabase';
import { getAuth } from '@clerk/clerk-react';

const getSupabaseClient = async () => {
  const { getToken } = getAuth();
  const token = await getToken({ template: 'supabase' });
  return createSupabaseClient(token);
};

export const fetchContacts = async () => {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('contacts')
    .select('*, users(name)')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const fetchJobs = async () => {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*, contacts(name, email)')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const fetchDocuments = async () => {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('documents')
    .select('*, contacts(name)')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const fetchInvoices = async () => {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('invoices')
    .select('*, contacts(full_name), jobs(job_type)')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const fetchStages = async () => {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('stages')
    .select('*, steps(*)')
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const fetchActivities = async (contactId) => {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('activities')
    .select('*, steps(name, stages(name))')
    .eq('contact_id', contactId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createContact = async (contactData) => {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('contacts')
    .insert([contactData])
    .single();

  if (error) throw error;
  return data;
};

export const updateContact = async (id, contactData) => {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('contacts')
    .update(contactData)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createJob = async (jobData) => {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('jobs')
    .insert([jobData])
    .single();

  if (error) throw error;
  return data;
};

export const updateJob = async (id, jobData) => {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('jobs')
    .update(jobData)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createActivity = async (activityData) => {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('activities')
    .insert([activityData])
    .single();

  if (error) throw error;
  return data;
};

export const fetchTasks = async (userId) => {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.rpc('get_user_tasks', { p_user_id: userId });
  if (error) throw error;
  return data;
};

export const fetchContactTasks = async (contactId) => {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('contact_id', contactId)
    .order('priority', { ascending: false })
    .order('due_date', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const createTask = async (taskData) => {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('tasks')
    .insert([taskData])
    .single();

  if (error) throw error;
  return data;
};

export const updateTask = async ({ taskId, updates }) => {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .single();

  if (error) throw error;
  return data;
};

export const fetchTaskStatistics = async (userId, isManager) => {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.rpc('get_task_statistics', {
    p_user_id: userId,
    p_is_manager: isManager
  });

  if (error) throw error;
  return data;
};

export const fetchSalesKPIs = async () => {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.rpc('get_sales_kpis');
  if (error) throw error;
  return data;
};

export const fetchLeadFunnelData = async () => {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.rpc('get_lead_funnel_data');
  if (error) throw error;
  return data;
};

export const fetchRecentSalesActivities = async () => {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.rpc('get_recent_sales_activities');
  if (error) throw error;
  return data;
};

export const fetchSalesPerformance = async () => {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.rpc('get_sales_performance');
  if (error) throw error;
  return data;
};

export const fetchLeadSourceDistribution = async () => {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.rpc('get_lead_source_distribution');
  if (error) throw error;
  return data;
};

export const fetchSalesProcess = async () => {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('stages')
    .select('*, steps(*)')
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data;
};
