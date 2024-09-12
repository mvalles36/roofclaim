import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '../integrations/supabase/supabase';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '' });

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
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contacts;