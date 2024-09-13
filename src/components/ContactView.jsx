import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '../integrations/supabase/supabase';

const ContactView = ({ contactId }) => {
  const [contactDetails, setContactDetails] = useState(null);

  useEffect(() => {
    fetchContactDetails();
  }, [contactId]);

  const fetchContactDetails = async () => {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        insurance_policies (*),
        inspections (*),
        supplements (*)
      `)
      .eq('id', contactId)
      .single();

    if (error) {
      console.error('Error fetching contact details:', error);
    } else {
      setContactDetails(data);
    }
  };

  if (!contactDetails) return <div>Loading...</div>;

  return (
    <Tabs defaultValue="details">
      <TabsList>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="insurance">Insurance Policies</TabsTrigger>
        <TabsTrigger value="inspections">Inspections</TabsTrigger>
        <TabsTrigger value="supplements">Supplements</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <h3 className="text-lg font-semibold mb-2">Contact Details</h3>
        <p>Name: {contactDetails.name}</p>
        <p>Email: {contactDetails.email}</p>
        <p>Phone: {contactDetails.phone}</p>
        <p>Address: {contactDetails.address}</p>
      </TabsContent>
      <TabsContent value="insurance">
        <h3 className="text-lg font-semibold mb-2">Insurance Policies</h3>
        {contactDetails.insurance_policies.length > 0 ? (
          <ul>
            {contactDetails.insurance_policies.map((policy) => (
              <li key={policy.id}>
                <p>Policy Number: {policy.policy_number}</p>
                <p>Provider: {policy.provider}</p>
                <a href={policy.document_url} target="_blank" rel="noopener noreferrer">View Policy Document</a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No insurance policies found.</p>
        )}
      </TabsContent>
      <TabsContent value="inspections">
        <h3 className="text-lg font-semibold mb-2">Inspections</h3>
        {contactDetails.inspections.length > 0 ? (
          <ul>
            {contactDetails.inspections.map((inspection) => (
              <li key={inspection.id}>
                <p>Date: {new Date(inspection.inspection_date).toLocaleDateString()}</p>
                <p>Status: {inspection.status}</p>
                {inspection.report_url && (
                  <a href={inspection.report_url} target="_blank" rel="noopener noreferrer">View Inspection Report</a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No inspections found.</p>
        )}
      </TabsContent>
      <TabsContent value="supplements">
        <h3 className="text-lg font-semibold mb-2">Supplements</h3>
        {contactDetails.supplements.length > 0 ? (
          <ul>
            {contactDetails.supplements.map((supplement) => (
              <li key={supplement.id}>
                <p>Date: {new Date(supplement.created_at).toLocaleDateString()}</p>
                <p>Status: {supplement.status}</p>
                <p>Amount: ${supplement.amount}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No supplements found.</p>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ContactView;