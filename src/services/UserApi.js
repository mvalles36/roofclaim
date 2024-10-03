import { supabase } from '../integrations/supabase/supabase';

export const getUserByRole = async (role) => {
  try {
    const { data, error, status } = await supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .limit(1); // Limit to one user

    // Handle the error based on its status code
    if (error) {
      console.error(`Error fetching user by role: ${error.message} (Status: ${status})`);
      throw new Error(`Unable to fetch user by role. Please try again later.`);
    }

    // Check if data is an array and return the first item or null if no user is found
    return data.length > 0 ? data[0] : null;
  } catch (err) {
    console.error('Unexpected error:', err);
    throw new Error('An unexpected error occurred.'); // Return a generic error message for unexpected errors
  }
};
