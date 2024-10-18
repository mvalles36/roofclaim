import { supabase } from '../integrations/supabase/supabase';

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