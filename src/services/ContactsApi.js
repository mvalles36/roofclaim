import { supabase } from '../integrations/supabase/supabase';

/**
 * Contacts API for managing contacts in the Supabase database.
 */
const ContactsApi = {
  /**
   * Fetch all contacts from the database.
   * @returns {Promise<Object[]>} A promise that resolves to an array of contact objects.
   */
  fetchContacts: async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select('id, first_name, last_name, email, phone, status');

    if (error) {
      console.error('Error fetching contacts:', error);
      throw new Error(`Failed to fetch contacts: ${error.message}`);
    }

    // Combine first_name and last_name into a single name field for display
    const contacts = data.map(contact => ({
      ...contact,
      name: `${contact.first_name} ${contact.last_name}`.trim(),
    }));

    return contacts;
  },

  /**
   * Create a new contact in the database.
   * @param {Object} contactData - The contact data to insert.
   * @param {string} [contactData.name] - The combined name (first and last).
   * @param {string} contactData.email - The email of the contact.
   * @param {string} contactData.phone - The phone number of the contact.
   * @param {string} [contactData.status] - The status of the contact.
   * @returns {Promise<Object>} The created contact object.
   */
  createContact: async (contactData) => {
    // Validate input
    if (!contactData.email) {
      throw new Error('Email is required to create a contact.');
    }

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
      console.error('Error creating contact:', error);
      throw new Error(`Failed to create contact: ${error.message}`);
    }

    return data;
  },

  /**
   * Update an existing contact in the database.
   * @param {string|number} id - The ID of the contact to update.
   * @param {Object} updates - The updates to apply to the contact.
   * @param {string} [updates.name] - The combined name (first and last) to split.
   * @returns {Promise<Object>} The updated contact object.
   */
  updateContact: async (id, updates) => {
    // Validate input
    if (!id) {
      throw new Error('Contact ID is required to update a contact.');
    }

    if (updates.name) {
      const [first, ...rest] = updates.name.trim().split(' ');
      updates.first_name = first || '';
      updates.last_name = rest.join(' ') || '';
      delete updates.name; // Remove the combined name field before sending to the backend
    }

    const { data, error } = await supabase.from('contacts').update(updates).eq('id', id);

    if (error) {
      console.error('Error updating contact:', error);
      throw new Error(`Failed to update contact: ${error.message}`);
    }

    return data;
  },
};

export default ContactsApi;
