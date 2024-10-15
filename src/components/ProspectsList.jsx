import React from 'react';
import { Button } from "@/components/ui/button";
import { useAddContacts } from '../integrations/supabase/hooks/useContacts';
import { toast } from 'sonner';

const ProspectsList = ({ prospects }) => {
  const addContactsMutation = useAddContacts();

  const handleSaveProspects = async () => {
    try {
      const contactsToAdd = prospects.map(prospect => ({
        full_name: prospect.AddressLine1,
        address: `${prospect.AddressLine1}, ${prospect.City}, ${prospect.State} ${prospect.PostalCode}`,
        telephone: prospect.TelephoneNumber,
        email: prospect.EmailAddress,
        income: prospect.Income,
        coordinates: JSON.stringify({ lat: prospect.Latitude, lng: prospect.Longitude }),
        mak: prospect.MAK,
        contact_status: 'Prospect'
      }));

      await addContactsMutation.mutateAsync(contactsToAdd);
      toast.success(`${prospects.length} prospects saved successfully!`);
    } catch (error) {
      console.error("Error saving prospects:", error);
      toast.error("An error occurred while saving prospects. Please try again.");
    }
  };

  return (
    <div>
      <p>Total prospects found: {prospects.length}</p>
      <div className="max-h-96 overflow-y-auto">
        {prospects.map((prospect, index) => (
          <div key={index} className="mb-2">
            <p><strong>Address:</strong> {prospect.AddressLine1}, {prospect.City}, {prospect.State} {prospect.PostalCode}</p>
          </div>
        ))}
      </div>
      <Button onClick={handleSaveProspects} className="mt-4">Save Prospects to Contacts</Button>
    </div>
  );
};

export default ProspectsList;