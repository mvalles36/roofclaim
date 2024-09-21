import React from 'react';
import { Button } from "@/components/ui/button";
import { useAddContacts } from '../integrations/supabase/hooks/useContacts';
import { toast } from 'sonner';

const LeadsList = ({ leads }) => {
  const addContactsMutation = useAddContacts();

  const handleSaveLeads = async () => {
    try {
      const contactsToAdd = leads.map(lead => ({
        full_name: lead.AddressLine1,
        address: `${lead.AddressLine1}, ${lead.City}, ${lead.State} ${lead.PostalCode}`,
        telephone: lead.TelephoneNumber,
        email: lead.EmailAddress,
        income: lead.Income,
        coordinates: JSON.stringify({ lat: lead.Latitude, lng: lead.Longitude }),
        mak: lead.MAK,
        lead_status: 'New Lead'
      }));

      await addContactsMutation.mutateAsync(contactsToAdd);
      toast.success(`${leads.length} leads saved successfully!`);
    } catch (error) {
      console.error("Error saving leads:", error);
      toast.error("An error occurred while saving leads. Please try again.");
    }
  };

  return (
    <div>
      <p>Total leads found: {leads.length}</p>
      <div className="max-h-96 overflow-y-auto">
        {leads.map((lead, index) => (
          <div key={index} className="mb-2">
            <p><strong>Address:</strong> {lead.AddressLine1}, {lead.City}, {lead.State} {lead.PostalCode}</p>
          </div>
        ))}
      </div>
      <Button onClick={handleSaveLeads} className="mt-4">Save Leads to Contacts</Button>
    </div>
  );
};

export default LeadsList;