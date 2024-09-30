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
    // Parse the full name into first_name and last_name
    const [first_name, ...lastNameParts] = contactData.name.split(' ');
    const last_name = lastNameParts.join(' ') || null;

    const newContact = {
      first_name: first_name || '',
      last_name: last_name || '',
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
    const { data, error } = await supabase.from('contacts').update(updates).eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },
};

export default ContactsApi;
