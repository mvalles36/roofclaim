import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '../integrations/supabase/supabase';

const ContactView = ({ contactId }) => {
  const [contactDetails, setContactDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContactDetails();
  }, [contactId]);

  const fetchContactDetails = async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select(`
        *,
        insurance_policies (*),
        inspections (*),
        supplements (*),
        documents (*),    // Fetching associated documents
        jobs (*)
      `)
      .eq('id', contactId)
      .single();

    if (error) {
      setError('Failed to fetch contact details');
      console.error('Error fetching contact details:', error);
    } else {
      setContactDetails(data);
    }
  };

  if (error) return <div>{error}</div>;
  if (!contactDetails) return <div>Loading...</div>;

  return (
    <Tabs defaultValue="details">
      <TabsList>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="insurance">Insurance Policies</TabsTrigger>
        <TabsTrigger value="inspections">Inspections</TabsTrigger>
        <TabsTrigger value="supplements">Supplements</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger> {/* New Tab for Documents */}
      </TabsList>
      <TabsContent value="details">
        <h3 className="text-lg font-semibold mb-2">Contact Details</h3>
        <p>Name: {contactDetails.full_name}</p>
        <p>Email: {contactDetails.email}</p>
        <p>Phone: {contactDetails.phone_number}</p>
        <p>Address: {contactDetails.address}</p>
        {contactDetails.latitude && contactDetails.longitude && (
          <img
            src={`https://maps.googleapis.com/maps/api/streetview?size=400x200&location=${contactDetails.latitude},${contactDetails.longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
            alt="Street View"
            className="mt-4 rounded-lg"
          />
        )}
      </TabsContent>
      {/* ... (rest of the TabsContent for insurance, inspections, and supplements) */}
      <TabsContent value="documents">
        <h3 className="text-lg font-semibold mb-2">Documents Sent</h3>
        {contactDetails.documents && contactDetails.documents.length > 0 ? (
          <ul>
            {contactDetails.documents.map((doc) => (
              <li key={doc.id}>
                <p>Date: {new Date(doc.sent_at).toLocaleDateString()}</p>
                <a href={doc.url} target="_blank" rel="noopener noreferrer">View Document</a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No documents found.</p>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ContactView;
