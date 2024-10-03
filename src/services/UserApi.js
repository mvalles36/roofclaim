import { supabase } from '../integrations/supabase/supabase';

export const getUserByRole = async (role) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', role)
    .limit(1); // Limit the results to one

  if (error) {
    console.error('Error fetching user by role:', error);
    throw error;
  }

  // Check if data is an array and return the first item or null if no user is found
  return data.length > 0 ? data[0] : null;
};
