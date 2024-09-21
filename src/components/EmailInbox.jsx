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
import EmailSequenceBuilder from './EmailSequenceBuilder';
import InboxView from './InboxView';
import ComposeEmail from './ComposeEmail';

const EmailInbox = () => {
  const [emails, setEmails] = useState([]);
  const [sequences, setSequences] = useState([]);
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

  const handleSaveSequence = async (newSequence) => {
    try {
      const { data, error } = await supabase.from('email_sequences').insert([newSequence]);
      if (error) throw error;
      setSequences([...sequences, data[0]]);
      toast.success('Email sequence saved successfully');
    } catch (error) {
      console.error('Error saving sequence:', error);
      toast.error('Failed to save email sequence');
    }
  };

  const handleStartSequence = async (sequenceId, selectedContacts) => {
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
          <InboxView emails={emails} />
        </TabsContent>
        <TabsContent value="compose">
          <ComposeEmail onSend={fetchEmails} />
        </TabsContent>
        <TabsContent value="sequences">
          <EmailSequenceBuilder
            sequences={sequences}
            contacts={contacts}
            onSaveSequence={handleSaveSequence}
            onStartSequence={handleStartSequence}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailInbox;
