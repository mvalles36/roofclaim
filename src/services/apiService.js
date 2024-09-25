import { supabase } from '../integrations/supabase/supabase';

export const fetchContacts = async () => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('full_name', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const fetchJobs = async () => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*, contacts(id, full_name, email)')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const fetchInvoices = async () => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, contacts(full_name), jobs(job_type)')
    .order('invoice_date', { ascending: false });
  
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

export const fetchSalesProcess = async () => {
  const { data: processData, error: processError } = await supabase
    .from('sales_process')
    .select('*')
    .single();

  if (processError) throw processError;

  const { data: stagesData, error: stagesError } = await supabase
    .from('stages')
    .select('*')
    .eq('process_id', processData.id)
    .order('order_index', { ascending: true });

  if (stagesError) throw stagesError;

  const stagesWithSteps = await Promise.all(stagesData.map(async (stage) => {
    const { data: stepsData, error: stepsError } = await supabase
      .from('steps')
      .select('*')
      .eq('stage_id', stage.id)
      .order('order_index', { ascending: true });

    if (stepsError) throw stepsError;

    return { ...stage, steps: stepsData };
  }));

  return { ...processData, stages: stagesWithSteps };
};