import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '../integrations/supabase/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '' });
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching contacts:', error);
    } else {
      setContacts(data);
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('users')
      .insert([newContact]);

    if (error) {
      console.error('Error adding contact:', error);
    } else {
      fetchContacts();
      setNewContact({ name: '', email: '', phone: '' });
    }
  };

  const fetchContactDetails = async (contactId) => {
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
      setSelectedContact(data);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Contacts</h1>
      <Card>
        <CardHeader>
          <CardTitle>Add New Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddContact} className="space-y-4">
            <Input
              placeholder="Name"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              required
            />
            <Input
              placeholder="Phone"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            />
            <Button type="submit">Add Contact</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Contact List</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {contacts.map((contact) => (
              <li key={contact.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{contact.name}</p>
                  <p>{contact.email}</p>
                  <p>{contact.phone}</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => fetchContactDetails(contact.id)}>View Details</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{selectedContact?.name}</DialogTitle>
                    </DialogHeader>
                    {selectedContact && (
                      <Tabs defaultValue="insurance">
                        <TabsList>
                          <TabsTrigger value="insurance">Insurance Policies</TabsTrigger>
                          <TabsTrigger value="inspections">Inspections</TabsTrigger>
                          <TabsTrigger value="supplements">Supplements</TabsTrigger>
                        </TabsList>
                        <TabsContent value="insurance">
                          <h3 className="text-lg font-semibold mb-2">Insurance Policies</h3>
                          {selectedContact.insurance_policies.length > 0 ? (
                            <ul>
                              {selectedContact.insurance_policies.map((policy) => (
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
                          {selectedContact.inspections.length > 0 ? (
                            <ul>
                              {selectedContact.inspections.map((inspection) => (
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
                          {selectedContact.supplements.length > 0 ? (
                            <ul>
                              {selectedContact.supplements.map((supplement) => (
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
                    )}
                  </DialogContent>
                </Dialog>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contacts;