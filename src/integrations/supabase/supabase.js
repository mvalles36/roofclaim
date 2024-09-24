import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl) {
  throw new Error('Supabase URL must be set in environment variables');
}

if (!supabaseKey) {
  throw new Error('Supabase API key must be set in environment variables');
}

if (import.meta.env.MODE === 'development') {
  console.log('Supabase URL:', supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functions for the new tables
export const getStages = async () => {
  const { data, error } = await supabase.from('Stages').select('*');
  if (error) throw error;
  return data;
};

export const getSteps = async (stageId) => {
  const { data, error } = await supabase.from('Steps').select('*').eq('stage_id', stageId);
  if (error) throw error;
  return data;
};

export const getActivities = async (stepId) => {
  const { data, error } = await supabase.from('Activities').select('*').eq('step_id', stepId);
  if (error) throw error;
  return data;
};

export const getTools = async (stepId) => {
  const { data, error } = await supabase.from('Tools').select('*').eq('step_id', stepId);
  if (error) throw error;
  return data;
};

export const getExpectedOutcomes = async (stepId) => {
  const { data, error } = await supabase.from('ExpectedOutcomes').select('*').eq('step_id', stepId);
  if (error) throw error;
  return data;
};

export const getChallenges = async (stepId) => {
  const { data, error } = await supabase.from('Challenges').select('*').eq('step_id', stepId);
  if (error) throw error;
  return data;
};

// New functions for CustomerSuccessDashboard
export const getSupplementKPIs = async () => {
  const { data, error } = await supabase.rpc('get_supplement_kpis');
  if (error) throw error;
  return data;
};

export const getCurrentSupplementRequests = async () => {
  const { data, error } = await supabase.from('SupplementRequests').select('*').eq('status', 'pending');
  if (error) throw error;
  return data;
};

export const getSupplementPerformanceHistory = async () => {
  const { data, error } = await supabase.rpc('get_supplement_performance_history');
  if (error) throw error;
  return data;
};
