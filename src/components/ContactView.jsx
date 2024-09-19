import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '../integrations/supabase/supabase';
import { toast } from 'sonner';

const ContactView = ({ contactId }) => {
  const [contactDetails, setContactDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContactDetails();
  }, [contactId]);

  const fetchContactDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select(`
          *,
          insurance_policies (*),
          inspections (*),
          supplements (*),
          documents (*),
          jobs (*)
        `)
        .eq('id', contactId)
        .single();

      if (error) throw error;
      setContactDetails(data);
    } catch (error) {
      setError('Failed to fetch contact details');
      console.error('Error fetching contact details:', error);
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
        <TabsTrigger value="documents">Documents</TabsTrigger>
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
      <TabsContent value="insurance">
        <h3 className="text-lg font-semibold mb-2">Insurance Policies</h3>
        {contactDetails.insurance_policies && contactDetails.insurance_policies.length > 0 ? (
          <ul>
            {contactDetails.insurance_policies.map((policy) => (
              <li key={policy.id}>
                <p>Policy Name: {policy.name}</p>
                <p>Policy Number: {policy.policy_number}</p>
                <p>Policy Type: {policy.policy_type}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No insurance policies found.</p>
        )}
      </TabsContent>
      <TabsContent value="inspections">
        <h3 className="text-lg font-semibold mb-2">Inspections</h3>
        {contactDetails.inspections && contactDetails.inspections.length > 0 ? (
          <ul>
            {contactDetails.inspections.map((inspection) => (
              <li key={inspection.id}>
                <p>Inspection Date: {new Date(inspection.inspection_date).toLocaleDateString()}</p>
                <p>Inspection Type: {inspection.inspection_type}</p>
                <p>Inspection Result: {inspection.inspection_result}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No inspections found.</p>
        )}
      </TabsContent>
      <TabsContent value="supplements">
        <h3 className="text-lg font-semibold mb-2">Supplements</h3>
        {contactDetails.supplements && contactDetails.supplements.length > 0 ? (
          <ul>
            {contactDetails.supplements.map((supplement) => (
              <li key={supplement.id}>
                <p>Supplement Name: {supplement.name}</p>
                <p>Supplement Type: {supplement.supplement_type}</p>
                <p>Supplement Dosage: {supplement.supplement_dosage}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No supplements found.</p>
        )}
      </TabsContent>
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
