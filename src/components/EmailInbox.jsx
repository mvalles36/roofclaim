import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { Mail, Plus } from 'lucide-react';
import { supabase } from '../integrations/supabase/supabase';
import InboxView from './InboxView';
import ComposeEmail from './ComposeEmail';
import SequenceBuilder from './SequenceBuilder';
import ProspectSelector from './ProspectSelector';
import SequenceVisualizer from './SequenceVisualizer';

const EmailInbox = () => {
  const [emails, setEmails] = useState([]);
  const [sequences, setSequences] = useState([]);
  const [selectedSequence, setSelectedSequence] = useState(null);

  useEffect(() => {
    fetchEmails();
    fetchSequences();
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
      const { data, error } = await supabase.from('sequences').select('*');
      if (error) throw error;
      setSequences(data);
    } catch (error) {
      console.error('Error fetching sequences:', error);
      toast.error('Failed to fetch sequences');
    }
  };

  const handleSaveSequence = async (newSequence) => {
    try {
      const { data, error } = await supabase.from('sequences').insert([newSequence]);
      if (error) throw error;
      setSequences([...sequences, data[0]]);
      toast.success('Sequence saved successfully');
    } catch (error) {
      console.error('Error saving sequence:', error);
      toast.error('Failed to save sequence');
    }
  };

  const handleStartSequence = async (sequenceId, selectedProspects) => {
    try {
      // Here you would typically start the sequence for selected prospects
      console.log(`Starting sequence ${sequenceId} for prospects:`, selectedProspects);
      toast.success('Sequence started for selected prospects');
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
          <Card>
            <CardHeader>
              <CardTitle>Sequence Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <SequenceBuilder
                onSaveSequence={handleSaveSequence}
                onStartSequence={handleStartSequence}
              />
              {selectedSequence && (
                <SequenceVisualizer sequence={selectedSequence} />
              )}
              <ProspectSelector onSelectProspects={(prospects) => console.log('Selected prospects:', prospects)} />
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Saved Sequences</CardTitle>
            </CardHeader>
            <CardContent>
              {sequences.map((sequence) => (
                <div key={sequence.id} className="flex items-center justify-between p-2 border-b">
                  <span>{sequence.name}</span>
                  <Button onClick={() => setSelectedSequence(sequence)}>View</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailInbox;
