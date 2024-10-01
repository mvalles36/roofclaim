import { supabase } from '../integrations/supabase/supabase';

/**
 * Create a new job entry in the database.
 * @param {Object} newJob - The job details to insert.
 * @param {string} newJob.title - The title of the job.
 * @param {string} newJob.description - A description of the job.
 * @param {number} newJob.contact_id - The ID of the associated contact.
 * @returns {Promise<Object>} The created job data or an error message.
 */
export const createJob = async (newJob) => {
  // Validate input
  if (!newJob || !newJob.contact_id) {
    throw new Error('Invalid job data: contact_id is required.');
  }

  const { data, error } = await supabase.from('jobs').insert([newJob]);

  if (error) {
    console.error('Error creating job:', error);
    throw new Error(`Failed to create job: ${error.message}`);
  }

  return data;
};

/**
 * Retrieve jobs associated with a specific contact ID.
 * @param {string|number} contactId - The ID of the contact whose jobs to retrieve.
 * @returns {Promise<Object[]>} An array of job data or an error message.
 */
export const getJobByContactId = async (contactId) => {
  // Validate input
  if (!contactId) {
    throw new Error('Invalid contact ID: contactId is required.');
  }

  const { data, error } = await supabase.from('jobs').select('*').eq('contact_id', contactId);

  if (error) {
    console.error('Error fetching jobs for contact:', error);
    throw new Error(`Failed to fetch jobs: ${error.message}`);
  }

  return data;
};
