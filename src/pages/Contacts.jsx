import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { useUser } from '@clerk/clerk-react';
import ContactsTable from '../components/ContactsTable';
import ContactForm from '../components/ContactForm';
import ContactView from '../components/ContactView';
import { fetchContacts, createContact } from '../services/contactService';

const Contacts = () => {
  const { user, isLoaded } = useUser();
  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const queryClient = useQueryClient();

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: fetchContacts,
    enabled: !!user,
  });

  const createContactMutation = useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries('contacts');
      toast.success('Contact added successfully');
    },
    onError: (error) => {
      toast.error(`Failed to add contact: ${error.message}`);
    },
  });

  const handleAddContact = (newContact) => {
    createContactMutation.mutate({ ...newContact, user_id: user?.id });
  };

  const filteredContacts = contacts.filter(contact => 
    contact.first_name?.toLowerCase().includes(search.toLowerCase()) || 
    contact.last_name?.toLowerCase().includes(search.toLowerCase()) || 
    contact.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (!isLoaded || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Contacts</h1>
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Contact</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <ContactForm onSubmit={handleAddContact} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact List</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactsTable 
                contacts={filteredContacts} 
                onSelectContact={setSelectedContact}
              />
            </CardContent>
          </Card>
        </div>
        <div>
          {selectedContact && (
            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactView contactId={selectedContact.id} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contacts;