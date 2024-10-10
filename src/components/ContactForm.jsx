import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUS_OPTIONS = {
  PROSPECT: "Prospect",
  QUALIFIED_LEAD: "Qualified Lead",
  CUSTOMER: "Customer",
};

const ContactForm = ({ onSubmit }) => {
  const [newContact, setNewContact] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    status: STATUS_OPTIONS.PROSPECT,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newContact);
    setNewContact({ first_name: '', last_name: '', email: '', phone: '', status: STATUS_OPTIONS.PROSPECT });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="First Name"
        value={newContact.first_name}
        onChange={(e) => setNewContact({ ...newContact, first_name: e.target.value })}
        required
      />
      <Input
        placeholder="Last Name"
        value={newContact.last_name}
        onChange={(e) => setNewContact({ ...newContact, last_name: e.target.value })}
        required
      />
      <Input
        placeholder="Email"
        type="email"
        value={newContact.email}
        onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
        required
      />
      <Input
        placeholder="Phone"
        type="tel"
        value={newContact.phone}
        onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
      />
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
  );
};

export default ContactForm;