import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { Mail, Plus, Send, Clock, User } from 'lucide-react';
import { supabase } from '../integrations/supabase/supabase';

const EmailInbox = () => {
  const [emails, setEmails] = useState([]);
  const [sequences, setSequences] = useState([]);
  const [newEmail, setNewEmail] = useState({ to: '', subject: '', body: '' });
  const [newSequence, setNewSequence] = useState({ name: '', steps: [] });
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchEmails();
    fetchSequences();
    fetchContacts();
  }, []);

  const fetchEmails = async () => {
    try {
      const { data, error } = await supabase.from('emails').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setEmails(data);
    } catch (error) {
      console.error('Error fetching emails:', error);
      toast.error('Failed to fetch emails');
    }
  };

  const fetchSequences = async () => {
    try {
      const { data, error } = await supabase.from('email_sequences').select('*');
      if (error) throw error;
      setSequences(data);
    } catch (error) {
      console.error('Error fetching sequences:', error);
      toast.error('Failed to fetch email sequences');
    }
  };

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase.from('contacts').select('id, full_name, email');
      if (error) throw error;
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to fetch contacts');
    }
  };

  const handleSendEmail = async () => {
    try {
      const { data, error } = await supabase.from('emails').insert([newEmail]);
      if (error) throw error;
      setEmails([data[0], ...emails]);
      setNewEmail({ to: '', subject: '', body: '' });
      toast.success('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    }
  };

  const handleAddSequenceStep = () => {
    setNewSequence(prev => ({
      ...prev,
      steps: [...prev.steps, { email: { subject: '', body: '' }, waitDays: 1 }]
    }));
  };

  const handleUpdateSequenceStep = (index, field, value) => {
    setNewSequence(prev => {
      const updatedSteps = [...prev.steps];
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        updatedSteps[index][parent][child] = value;
      } else {
        updatedSteps[index][field] = value;
      }
      return { ...prev, steps: updatedSteps };
    });
  };

  const handleSaveSequence = async () => {
    try {
      const { data, error } = await supabase.from('email_sequences').insert([newSequence]);
      if (error) throw error;
      setSequences([...sequences, data[0]]);
      setNewSequence({ name: '', steps: [] });
      toast.success('Email sequence saved successfully');
    } catch (error) {
      console.error('Error saving sequence:', error);
      toast.error('Failed to save email sequence');
    }
  };

  const handleStartSequence = async (sequenceId) => {
    try {
      // Here you would typically start the sequence for selected contacts
      // This is a placeholder for the actual implementation
      console.log(`Starting sequence ${sequenceId} for contacts:`, selectedContacts);
      toast.success('Sequence started for selected contacts');
    } catch (error) {
      console.error('Error starting sequence:', error);
      toast.error('Failed to start sequence');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Email Inbox</h1>
      <Tabs defaultValue="inbox">
        <TabsList>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="sequences">Sequences</TabsTrigger>
        </TabsList>
        <TabsContent value="inbox">
          <Card>
            <CardHeader>
              <CardTitle>Inbox</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emails.map((email) => (
                    <TableRow key={email.id}>
                      <TableCell>{email.from}</TableCell>
                      <TableCell>{email.subject}</TableCell>
                      <TableCell>{new Date(email.created_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="compose">
          <Card>
            <CardHeader>
              <CardTitle>Compose Email</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="To"
                  value={newEmail.to}
                  onChange={(e) => setNewEmail({ ...newEmail, to: e.target.value })}
                />
                <Input
                  placeholder="Subject"
                  value={newEmail.subject}
                  onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
                />
                <Textarea
                  placeholder="Body"
                  value={newEmail.body}
                  onChange={(e) => setNewEmail({ ...newEmail, body: e.target.value })}
                  rows={5}
                />
                <Button onClick={handleSendEmail}>
                  <Send className="mr-2 h-4 w-4" /> Send Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sequences">
          <Card>
            <CardHeader>
              <CardTitle>Email Sequences</CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create New Sequence
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create Email Sequence</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Sequence Name"
                      value={newSequence.name}
                      onChange={(e) => setNewSequence({ ...newSequence, name: e.target.value })}
                    />
                    {newSequence.steps.map((step, index) => (
                      <div key={index} className="space-y-2 border p-4 rounded">
                        <Input
                          placeholder="Subject"
                          value={step.email.subject}
                          onChange={(e) => handleUpdateSequenceStep(index, 'email.subject', e.target.value)}
                        />
                        <Textarea
                          placeholder="Body"
                          value={step.email.body}
                          onChange={(e) => handleUpdateSequenceStep(index, 'email.body', e.target.value)}
                          rows={3}
                        />
                        <Input
                          type="number"
                          placeholder="Wait Days"
                          value={step.waitDays}
                          onChange={(e) => handleUpdateSequenceStep(index, 'waitDays', parseInt(e.target.value))}
                        />
                      </div>
                    ))}
                    <Button onClick={handleAddSequenceStep}>
                      <Plus className="mr-2 h-4 w-4" /> Add Step
                    </Button>
                    <Button onClick={handleSaveSequence}>Save Sequence</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Existing Sequences</h3>
                {sequences.map((sequence) => (
                  <div key={sequence.id} className="flex items-center justify-between border p-4 rounded mb-2">
                    <span>{sequence.name}</span>
                    <Button onClick={() => handleStartSequence(sequence.id)}>Start Sequence</Button>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Select Contacts for Sequence</h3>
                <Select
                  multiple
                  value={selectedContacts}
                  onChange={(value) => setSelectedContacts(value)}
                >
                  {contacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.full_name} ({contact.email})
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailInbox;