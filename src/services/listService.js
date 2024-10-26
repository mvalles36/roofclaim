// services/listService.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const saveList = async (listData) => {
  try {
    const { data: savedList, error: listError } = await supabase
      .from('lists')
      .insert([
        {
          name: listData.name,
          company_id: listData.companyId,
          property_count: listData.properties.length,
          created_at: new Date().toISOString(),
        },
      ])
      .single();

    if (listError) throw new Error(listError.message);

    const properties = listData.properties.map((property) => ({
      ...property,
      list_id: savedList.id,
    }));

    const { error: propertiesError } = await supabase
      .from('properties')
      .insert(properties);

    if (propertiesError) {
      // Delete list if property insertion fails
      await supabase.from('lists').delete().eq('id', savedList.id);
      throw new Error(propertiesError.message);
    }

    return savedList;
  } catch (error) {
    console.error('Error saving list:', error);
    throw error;
  }
};

const sendToSupabase = async (listId, listData) => {
  try {
    const response = await fetch(`${SUPBASE_URL}/supabase/lists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listId,
        companyId: listData.companyId,
        properties: listData.properties.map(property => ({
          address: property.address,
          details: property.details,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send list to Supabase');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending to Supabase:', error);
    throw error;
  }
};
