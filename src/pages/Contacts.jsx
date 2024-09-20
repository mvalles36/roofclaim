import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { useRoleBasedAccess } from '../hooks/useRoleBasedAccess';
import { salesGPTService } from '../services/SalesGPTService';
import { toast } from 'sonner';
import { Phone, Mail, MapPin, Star, Calendar, Clock } from 'lucide-react';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const { session } = useSupabaseAuth();
  const { hasPermission } = useRoleBasedAccess();
  const [newContact, setNewContact] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    address: '',
    lead_status: 'New',
    tags: [],
  });
  const [aiResponse, setAiResponse] = useState('');

  useEffect(() => {
    fetchContacts();
  }, [session]);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to fetch contacts');
    }
  };

  const handleAddContact = async () => {
    try {
      const { data, error } = await supabase.from('contacts').insert([newContact]);
      if (error) throw error;
      fetchContacts();
      setNewContact({ full_name: '', email: '', phone_number: '', address: '', lead_status: 'New', tags: [] });
      toast.success('Contact added successfully');
    } catch (error) {
      console.error('Error adding contact:', error);
      toast.error('Failed to add contact');
    }
  };

  const handleUpdateLeadStatus = async (contactId, newStatus) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ lead_status: newStatus })
        .eq('id', contactId);
      if (error) throw error;
      fetchContacts();
      toast.success('Lead status updated successfully');
    } catch (error) {
      console.error('Error updating lead status:', error);
      toast.error('Failed to update lead status');
    }
  };

  const handleInitiateCall = async (contact) => {
    try {
      const response = await salesGPTService.initiateCall(
        { name: contact.full_name, phone: contact.phone_number },
        'Roof inspection after recent weather events'
      );
      setAiResponse(response);
    } catch (error) {
      console.error('Error initiating AI call:', error);
      toast.error('Failed to initiate AI call');
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contacts</h1>
        {hasPermission('write:contacts') && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add New Contact</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Full Name"
                  value={newContact.full_name}
                  onChange={(e) => setNewContact({ ...newContact, full_name: e.target.value })}
                />
                <Input
                  placeholder="Email"
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
                <Button onClick={handleAddContact}>Add Contact</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <Input
        placeholder="Search contacts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <Card>
        <CardHeader>
          <CardTitle>Contact List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarFallback>{contact.full_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{contact.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone_number}</TableCell>
                  <TableCell>
                    <Badge variant={contact.lead_status === 'New' ? 'default' : 'secondary'}>
                      {contact.lead_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" onClick={() => setSelectedContact(contact)}>View Details</Button>
                    <Button variant="outline" onClick={() => handleInitiateCall(contact)}>Initiate AI Call</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedContact && (
        <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedContact.full_name}</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="ai-response">AI Response</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <p className="flex items-center"><Mail className="mr-2" /> {selectedContact.email}</p>
                    <p className="flex items-center"><Phone className="mr-2" /> {selectedContact.phone_number}</p>
                    <p className="flex items-center"><MapPin className="mr-2" /> {selectedContact.address}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Lead Information</h3>
                    <p className="flex items-center"><Star className="mr-2" /> Status: {selectedContact.lead_status}</p>
                    <p className="flex items-center"><Calendar className="mr-2" /> Created: {new Date(selectedContact.created_at).toLocaleDateString()}</p>
                    <p className="flex items-center"><Clock className="mr-2" /> Last Updated: {new Date(selectedContact.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="ai-response">
                <div>
                  <h3 className="font-semibold mb-2">AI Call Response</h3>
                  <p>{aiResponse || "No AI call initiated yet."}</p>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Contacts;
