import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and API key must be set in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Create a new table for leads if it doesn't exist
const createLeadsTable = async () => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .limit(1);

  if (error && error.code === '42P01') {
    // Table doesn't exist, so create it
    const { error: createError } = await supabase
      .rpc('create_leads_table');

    if (createError) {
      console.error('Error creating leads table:', createError);
    } else {
      console.log('Leads table created successfully');
    }
  }
};

createLeadsTable();

// New RPC calls for Supplement Specialist Dashboard
export const getSupplementKPIs = async () => {
  const { data, error } = await supabase.rpc('get_supplement_kpis');
  if (error) throw error;
  return data;
};

export const getCurrentSupplementRequests = async () => {
  const { data, error } = await supabase.rpc('get_current_supplement_requests');
  if (error) throw error;
  return data;
};

export const getSupplementPerformanceHistory = async () => {
  const { data, error } = await supabase.rpc('get_supplement_performance_history');
  if (error) throw error;
  return data;
};
