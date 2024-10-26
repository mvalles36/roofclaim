// services/listService.js

const SUPBASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const saveList = async (listData) => {
  try {
    // First, save the list metadata
    const listResponse = await fetch(`${SUPBASE_URL}/lists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: listData.name,
        companyId: listData.companyId,
        propertyCount: listData.properties.length,
        createdAt: new Date().toISOString(),
      }),
    });

    if (!listResponse.ok) {
      throw new Error('Failed to create list');
    }

    const savedList = await listResponse.json();

    // Then, save the properties associated with this list
    const propertiesResponse = await fetch(`${SUPBASE_URL}/lists/${savedList.id}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: listData.properties.map(property => ({
          ...property,
          listId: savedList.id,
        })),
      }),
    });

    if (!propertiesResponse.ok) {
      // If properties save fails, delete the list to maintain consistency
      await fetch(`${SUPBASE_URL}/lists/${savedList.id}`, {
        method: 'DELETE',
      });
      throw new Error('Failed to save properties');
    }

    // Send to Supabase
    await sendToSupabase(savedList.id, listData);

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
