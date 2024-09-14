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

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { userRole } = useSupabaseAuth();
  const { hasPermission } = useRoleBasedAccess();
  const [newContact, setNewContact] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    lead_status: 'New',
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to fetch contacts');
    } else {
      setContacts(data);
    }
  };

  const handleAddContact = async () => {
    const { data, error } = await supabase.from('contacts').insert([newContact]);

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
        <Card>
          <CardHeader>
            <CardTitle>Add New Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleAddContact(); }} className="space-y-4">
              <Input
                placeholder="Full Name"
                value={newContact.full_name}
                onChange={(e) => setNewContact({ ...newContact, full_name: e.target.value })}
              />
              <Input
                placeholder="Email"
                type="email"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              />
              <Input
                placeholder="Phone Number"
                value={newContact.phone_number}
                onChange={(e) => setNewContact({ ...newContact, phone_number: e.target.value })}
              />
              <Button type="submit">Add Contact</Button>
            </form>
          </CardContent>
        </Card>
      )}
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
                  <p>Status: {contact.lead_status}</p>
                </div>
                {hasPermission('write:contacts') && (
                  <Select
                    value={contact.lead_status}
                    onValueChange={(value) => handleUpdateLeadStatus(contact.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Contacted">Contacted</SelectItem>
                      <SelectItem value="Qualified">Qualified</SelectItem>
                      <SelectItem value="Proposal">Proposal</SelectItem>
                      <SelectItem value="Converted">Converted</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contacts;
