import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { useUser } from '@clerk/clerk-react';
import ContactsTable from '../components/ContactsTable';
import ContactForm from '../components/ContactForm';
import { fetchContacts, createContact } from '../services/contactService';

const STATUS_OPTIONS = {
  PROSPECT: "Prospect",
  QUALIFIED_LEAD: "Qualified Lead",
  CUSTOMER: "Customer",
};

const Contacts = () => {
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: fetchContacts,
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
    createContactMutation.mutate(newContact);
  };

  const filteredContacts = contacts.filter(contact => 
    contact.first_name.toLowerCase().includes(search.toLowerCase()) || 
    contact.last_name.toLowerCase().includes(search.toLowerCase()) || 
    contact.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Contacts</h1>
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

      <div className="flex items-center">
        <Input
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ContactsTable contacts={filteredContacts} />
      )}
    </div>
  );
};

export default Contacts;