import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '../integrations/supabase/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [leadStatus, setLeadStatus] = useState('');
  const { userRole } = useSupabaseAuth();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('full_name', { ascending: true });

    if (error) {
      console.error('Error fetching contacts:', error);
    } else {
      setContacts(data);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateLeadStatus = async (contactId, newStatus) => {
    const { error } = await supabase
      .from('contacts')
      .update({ lead_status: newStatus })
      .eq('id', contactId);

    if (error) {
      console.error('Error updating lead status:', error);
    } else {
      fetchContacts();
    }
  };

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
                          {canViewFullDetails && (
                            <>
                              <p><strong>Lead Status:</strong> {contact.lead_status}</p>
                              <Select
                                value={leadStatus}
                                onValueChange={(value) => {
                                  setLeadStatus(value);
                                  handleUpdateLeadStatus(contact.id, value);
                                }}
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
