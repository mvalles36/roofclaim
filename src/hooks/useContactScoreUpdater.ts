import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase'; // Assuming you've set up Supabase client
import { generateContactScore } from '@/services/OpenRouterApi';

// Helper function to get contact data from cookie
const getContactFromCookie = () => {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('contactData='));
  if (cookieValue) {
    const encodedData = cookieValue.split('=')[1];
    return JSON.parse(atob(encodedData));
  }
  return null;
};

const useContactScoreUpdater = () => {
  useEffect(() => {
    const contactData = getContactFromCookie();
    if (!contactData) {
      console.warn("No contact data found in cookies.");
      return;
    }

    const { email, name } = contactData;

    const handleScoreUpdate = async (payload) => {
      const updatedContact = payload.new;

      // Fetch interaction data specific to the contact
      const interactions = await fetchInteractionData(updatedContact.id); // Fetch interactions based on contact ID
      const score = await generateContactScore(updatedContact, interactions);

      // Update the contact score in Supabase
      await supabase
        .from('contacts')
        .update({ score })
        .eq('id', updatedContact.id);

      // Log interaction for analytics (to display on dashboard)
      await supabase
        .from('interactions')
        .insert({
          contact_id: updatedContact.id,
          type: 'form_submission',
          timestamp: new Date().toISOString(),
          details: { email, name } // Add any relevant details from the form submission
        });
    };

    const subscription = supabase
      .from(`interactions:contact_id=eq.${contactData.id}`) // Ensure this references the correct contact ID
      .on('INSERT', handleScoreUpdate)
      .on('UPDATE', handleScoreUpdate)
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);
};

export default useContactScoreUpdater;
