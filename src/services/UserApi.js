
import { supabase } from '../integrations/supabase/supabase';

export const getUserByRole = async (role) => {
  const { data, error } = await supabase.from('users').select('*').eq('role', role);
  if (error) throw error;
  return data;
};
