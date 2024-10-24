import { supabase } from '../integrations/supabase/supabase';

export const fetchProspectsInArea = async (bounds) => {
  const { data, error } = await supabase
    .rpc('get_prospects_in_bounds', {
      north_bound: bounds.north,
      south_bound: bounds.south,
      east_bound: bounds.east,
      west_bound: bounds.west
    });

  if (error) {
    console.error('Error fetching prospects:', error);
    throw new Error('Failed to fetch prospects');
  }

  return data;
};

export const saveProspects = async (prospects) => {
  const { data, error } = await supabase
    .from('prospects')
    .insert(prospects);

  if (error) {
    console.error('Error saving prospects:', error);
    throw new Error('Failed to save prospects');
  }

  return data;
};