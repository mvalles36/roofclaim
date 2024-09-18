import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and API key must be set in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

const createLeadsTable = async () => {
  try {
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
    } else if (error) {
      console.error('Error checking leads table:', error);
    }
  } catch (error) {
    console.error('Error in createLeadsTable function:', error);
  }
};

createLeadsTable();

export const getSupplementKPIs = async () => {
  try {
    const { data, error } = await supabase.rpc('get_supplement_kpis');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching supplement KPIs:', error);
    throw error;
  }
};

export const getCurrentSupplementRequests = async () => {
  try {
    const { data, error } = await supabase.rpc('get_current_supplement_requests');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching current supplement requests:', error);
    throw error;
  }
};

export const getSupplementPerformanceHistory = async () => {
  try {
    const { data, error } = await supabase.rpc('get_supplement_performance_history');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching supplement performance history:', error);
    throw error;
  }
};
