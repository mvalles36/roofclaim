import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '../integrations/supabase/supabase';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { toast } from 'sonner';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const { userRole } = useSupabaseAuth();
  const [newContact, setNewContact] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    address: '',
    preferred_contact_method: '',
    lead_source: '',
    lead_status: 'New',
    salesperson_assigned: '',
    roofing_material_preferences: '',
    notes: '',
    last_interaction_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    let query = supabase.from('contacts').select('*');
    
    if (userRole === 'sales' || userRole === 'sales_manager') {
      const { data: { user } } = await supabase.auth.getUser();
      query = query.eq('salesperson_assigned', user.id);
    }

    const { data, error } = await query.order('full_name', { ascending: true });

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
      setNewContact({
        full_name: '',
        email: '',
        phone_number: '',
        address: '',
        preferred_contact_method: '',
        lead_source: '',
        lead_status: 'New',
        salesperson_assigned: '',
        roofing_material_preferences: '',
        notes: '',
        last_interaction_date: new Date().toISOString().split('T')[0]
      });
      toast.success('Contact added successfully');
    }
  };

  const handleUpdateContact = async (updatedContact) => {
    const { error } = await supabase
      .from('contacts')
      .update(updatedContact)
      .eq('id', updatedContact.id);

    if (error) {
      console.error('Error updating contact:', error);
      toast.error('Failed to update contact');
    } else {
      fetchContacts();
      toast.success('Contact updated successfully');
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
    const { data: contact, error: fetchError } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .single();

    if (fetchError) {
      console.error('Error fetching contact:', fetchError);
      toast.error('Failed to convert lead to customer');
      return;
    }

    const { error: insertError } = await supabase.from('customers').insert([{
      full_name: contact.full_name,
      email: contact.email,
      phone_number: contact.phone_number,
      address: contact.address,
      preferred_contact_method: contact.preferred_contact_method,
      customer_type: 'Residential', // Default value, can be updated later
      contact_id: contact.id
    }]);

    if (insertError) {
      console.error('Error converting lead to customer:', insertError);
      toast.error('Failed to convert lead to customer');
    } else {
      toast.success('Lead converted to customer successfully');
      // Trigger job creation here if needed
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canViewFullDetails = ['sales', 'sales_manager', 'admin'].includes(userRole);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Contacts</h1>
      <Input
        placeholder="Search contacts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
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
            <Input
              placeholder="Address"
              value={newContact.address}
              onChange={(e) => setNewContact({ ...newContact, address: e.target.value })}
            />
            <Select
              onValueChange={(value) => setNewContact({ ...newContact, preferred_contact_method: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Preferred Contact Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="text">Text</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => setNewContact({ ...newContact, lead_source: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Lead Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="social_media">Social Media</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Salesperson Assigned"
              value={newContact.salesperson_assigned}
              onChange={(e) => setNewContact({ ...newContact, salesperson_assigned: e.target.value })}
            />
            <Input
              placeholder="Roofing Material Preferences"
              value={newContact.roofing_material_preferences}
              onChange={(e) => setNewContact({ ...newContact, roofing_material_preferences: e.target.value })}
            />
            <Textarea
              placeholder="Notes"
              value={newContact.notes}
              onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
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
            {filteredContacts.map((contact) => (
              <li key={contact.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{contact.full_name}</p>
                  <p>{contact.email}</p>
                  {canViewFullDetails && (
                    <>
                      <p>Phone: {contact.phone_number}</p>
                      <p>Lead Status: {contact.lead_status}</p>
                    </>
                  )}
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => setSelectedContact(contact)}>View Details</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{contact.full_name}</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="details">
                      <TabsList>
                        <TabsTrigger value="details">Details</TabsTrigger>
                        {canViewFullDetails && (
                          <>
                            <TabsTrigger value="communication">Communication</TabsTrigger>
                            <TabsTrigger value="jobs">Jobs</TabsTrigger>
                          </>
                        )}
                      </TabsList>
                      <TabsContent value="details">
                        <div className="space-y-2">
                          <p><strong>Email:</strong> {contact.email}</p>
                          <p><strong>Phone:</strong> {contact.phone_number}</p>
                          <p><strong>Address:</strong> {contact.address}</p>
                          <p><strong>Preferred Contact Method:</strong> {contact.preferred_contact_method}</p>
                          <p><strong>Lead Source:</strong> {contact.lead_source}</p>
                          <p><strong>Roofing Material Preferences:</strong> {contact.roofing_material_preferences}</p>
                          <p><strong>Last Interaction Date:</strong> {new Date(contact.last_interaction_date).toLocaleDateString()}</p>
                          <p><strong>Notes:</strong> {contact.notes}</p>
                          {canViewFullDetails && (
                            <>
                              <p><strong>Lead Status:</strong> {contact.lead_status}</p>
                              <p><strong>Salesperson Assigned:</strong> {contact.salesperson_assigned}</p>
                              <Select
                                value={contact.lead_status}
                                onValueChange={(value) => handleUpdateLeadStatus(contact.id, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Update Lead Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="New">New</SelectItem>
                                  <SelectItem value="Contacted">Contacted</SelectItem>
                                  <SelectItem value="Quoted">Quoted</SelectItem>
                                  <SelectItem value="Lost">Lost</SelectItem>
                                  <SelectItem value="Converted">Converted</SelectItem>
                                </SelectContent>
                              </Select>
                            </>
                          )}
                        </div>
                      </TabsContent>
                      {canViewFullDetails && (
                        <>
                          <TabsContent value="communication">
                            <p>Communication history will be displayed here.</p>
                          </TabsContent>
                          <TabsContent value="jobs">
                            <p>Job history will be displayed here.</p>
                          </TabsContent>
                        </>
                      )}
                    </Tabs>
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
