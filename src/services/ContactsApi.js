import { supabase } from '../integrations/supabase/supabase';

const ContactsApi = {
  fetchContacts: async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select('id, first_name, last_name, email, phone, status');

    if (error) {
      throw new Error(error.message);
    }

    // Combine first_name and last_name into a single name field for display
    const contacts = data.map(contact => ({
      ...contact,
      name: `${contact.first_name} ${contact.last_name}`.trim(),
    }));

    return contacts;
  },

  createContact: async (contactData) => {
    let first_name = '';
    let last_name = '';

    // If the front-end sends 'name' as a single string, split it
    if (contactData.name) {
      const [first, ...rest] = contactData.name.trim().split(' ');
      first_name = first || '';
      last_name = rest.join(' ') || '';
    } else {
      // Otherwise, use first_name and last_name directly if they are provided
      first_name = contactData.first_name || '';
      last_name = contactData.last_name || '';
    }

    const newContact = {
      first_name,
      last_name,
      email: contactData.email,
      phone: contactData.phone,
      status: contactData.status || 'Prospect', // Default to 'Prospect'
    };

    const { data, error } = await supabase.from('contacts').insert([newContact]);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  updateContact: async (id, updates) => {
    let first_name = '';
    let last_name = '';

    // Check if the update includes a 'name' field to split
    if (updates.name) {
      const [first, ...rest] = updates.name.trim().split(' ');
      first_name = first || '';
      last_name = rest.join(' ') || '';
      updates.first_name = first_name;
      updates.last_name = last_name;
      delete updates.name; // Remove the combined name field before sending to the backend
    }

    const { data, error } = await supabase.from('contacts').update(updates).eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },
};

export default ContactsApi;
