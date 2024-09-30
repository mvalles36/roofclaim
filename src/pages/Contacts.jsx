import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import ContactsApi from '../services/ContactsApi';
import JobsApi from '../services/JobsApi';

const STATUS_OPTIONS = {
  PROSPECT: "Prospect",
  QUALIFIED_LEAD: "Qualified Lead",
  CUSTOMER: "Customer",
};

const Contacts = () => {
  const [newContact, setNewContact] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    status: STATUS_OPTIONS.PROSPECT // Set default status to Prospect
  });

  const queryClient = useQueryClient();

  const createContactMutation = useMutation({
    mutationFn: async (newContact) => {
      const { data, error } = await ContactsApi.createContact(newContact);
      if (error) throw error;

      // Check if the new contact is a customer and create a job if none exists
      if (data[0].status === STATUS_OPTIONS.CUSTOMER) {
        const jobExists = await JobsApi.checkJobForContact(data[0].id);
        if (!jobExists) {
          await JobsApi.createJobForContact(data[0].id);
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('contacts');
      toast.success('Contact added successfully');
    },
    onError: (error) => {
      toast.error(`Failed to add contact: ${error.message}`);
    },
  });

  const handleAddContact = (e) => {
    e.preventDefault();
    createContactMutation.mutate(newContact);
    setNewContact({ first_name: '', last_name: '', email: '', phone: '', status: STATUS_OPTIONS.PROSPECT });
  };

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
          <form onSubmit={handleAddContact} className="space-y-4">
            {/* Required fields */}
            <Input
              placeholder="First Name"
              value={newContact.first_name}
              onChange={(e) => setNewContact({ ...newContact, first_name: e.target.value })}
              required // First name is required
            />
            <Input
              placeholder="Last Name"
              value={newContact.last_name}
              onChange={(e) => setNewContact({ ...newContact, last_name: e.target.value })}
              required // Last name is required
            />
            <Input
              placeholder="Email"
              type="email"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              required // Email is required
            />
            <Input
              placeholder="Phone"
              type="tel"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            />
            {/* Status defaults to Prospect and uses enum */}
            <Select
              value={newContact.status}
              onValueChange={(value) => setNewContact({ ...newContact, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={STATUS_OPTIONS.PROSPECT}>Prospect</SelectItem>
                <SelectItem value={STATUS_OPTIONS.QUALIFIED_LEAD}>Qualified Lead</SelectItem>
                <SelectItem value={STATUS_OPTIONS.CUSTOMER}>Customer</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">Add Contact</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contacts;
