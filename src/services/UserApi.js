import { supabase } from '../integrations/supabase/supabase';

export const getUserByRole = async (role) => {
  try {
    const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('role', role)
  .limit(1); // Ensures you get one row only

if (error) {
  console.error('Error fetching user role:', error);
  throw error;
}

return data.length > 0 ? data[0] : null; // Handle the case when no rows are returned
