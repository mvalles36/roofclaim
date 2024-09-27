import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase'; // Assuming you've set up Supabase client
import { generateContactScore } from '@/services/OpenRouterApi';

type ContactScoreUpdaterProps = {
  contactId: string;
};

const useContactScoreUpdater = ({ contactId }: ContactScoreUpdaterProps) => {
  useEffect(() => {
    const handleScoreUpdate = async (payload: any) => {
      const updatedContact = payload.new;
      const interactions = await fetchInteractionData(contactId); // Fetch updated interaction data
      const score = await generateContactScore(updatedContact, interactions);

      // Update the contact score in Supabase
      await supabase
        .from('contacts')
        .update({ score })
        .eq('id', contactId);
    };

    const subscription = supabase
      .from(`interactions:contact_id=eq.${contactId}`)
      .on('INSERT', handleScoreUpdate)
      .on('UPDATE', handleScoreUpdate)
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [contactId]);
};

export default useContactScoreUpdater;
