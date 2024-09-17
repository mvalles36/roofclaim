import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { useRoleBasedAccess } from '../hooks/useRoleBasedAccess';
import { toast } from 'sonner';
import ContactView from '../components/ContactView';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { userRole, session } = useSupabaseAuth();
  const { hasPermission } = useRoleBasedAccess();
  const [newContact, setNewContact] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    lead_status: 'New',
  });
  const [selectedContact, setSelectedContact] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, [session]);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contacts:', error);
        toast.error('Failed to fetch contacts');
      } else {
        setContacts(data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContact = async () => {
    const { data, error } = await supabase.from('contacts').insert([{
      ...newContact,
      user_id: session.user.id
    }]);

    if (error) {
      console.error('Error adding contact:', error);
      toast.error('Failed to add contact');
    } else {
      fetchContacts();
      setNewContact({ full_name: '', email: '', phone_number: '', lead_status: 'New' });
      toast.success('Contact added successfully');
    }
  };

  const handleUpdateLeadStatus = async (contactId, newStatus) => {
    const { error } = await supabase
      .from('contacts')
      .update({ lead_status: newStatus })
      .eq('id', contactId);

    if (error) {
      console.error('Error updating lead status:', error);
      toast.error('Failed to update lead status');
    } else {
      fetchContacts();
      toast.success('Lead status updated successfully');
      if (newStatus === 'Converted') {
        await convertLeadToCustomer(contactId);
      }
    }
  };

  const convertLeadToCustomer = async (contactId) => {
    const { data, error } = await supabase.rpc('convert_lead_to_customer', { contact_id: contactId });

    if (error) {
      console.error('Error converting lead to customer:', error);
      toast.error('Failed to convert lead to customer');
    } else {
      toast.success('Lead converted to customer successfully');
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Contacts</h1>
      <Input
        placeholder="Search contacts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {hasPermission('write:contacts') && (
        <Button onClick={handleAddContact}>Add New Contact</Button>
      )}
      {isLoading ? (
        <p>Loading contacts...</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Contact List</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {filteredContacts.map((contact) => (
                <li key={contact.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{contact.full_name}</p>
                    <p>{contact.email}</p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => setSelectedContact(contact)}>View Details</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>{contact.full_name}</DialogTitle>
                      </DialogHeader>
                      <ContactView contactId={contact.id} />
                    </DialogContent>
                  </Dialog>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Contacts;
