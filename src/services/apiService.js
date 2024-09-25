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

export const fetchSalesKPIs = async () => {
  const { data, error } = await supabase.rpc('get_sales_kpis');
  if (error) throw error;
  return data;
};

export const fetchLeadFunnelData = async () => {
  const { data, error } = await supabase.rpc('get_lead_funnel_data');
  if (error) throw error;
  return data;
};

export const fetchRecentSalesActivities = async () => {
  const { data, error } = await supabase.rpc('get_recent_sales_activities');
  if (error) throw error;
  return data;
};

export const fetchSalesPerformance = async () => {
  const { data, error } = await supabase.rpc('get_sales_performance');
  if (error) throw error;
  return data;
};

export const fetchLeadSourceDistribution = async () => {
  const { data, error } = await supabase.rpc('get_lead_source_distribution');
  if (error) throw error;
  return data;
};
