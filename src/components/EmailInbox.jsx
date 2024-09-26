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
import { salesGPTService } from '../services/SalesGPTService';
import { useSupabaseAuth } from '../integrations/supabase/auth';

const EmailInbox = () => {
  const [emails, setEmails] = useState([]);
  const [sequences, setSequences] = useState([]);
  const [selectedSequence, setSelectedSequence] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const { session } = useSupabaseAuth();

  useEffect(() => {
    if (session) {
      fetchEmails();
      fetchSequences();
      fetchUserProfile();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to fetch user profile');
    } else {
      setUserProfile(data);
    }
  };

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
    if (!userProfile || !userProfile.email_provider || !userProfile.email_api_key || !userProfile.email_domain) {
      toast.error('Please configure your email settings in your profile before starting a sequence.');
      return;
    }

    try {
      console.log(`Starting sequence ${sequenceId} for prospects:`, selectedProspects);
      
      const sequence = sequences.find(seq => seq.id === sequenceId);
      for (const step of sequence.steps) {
        if (step.type === 'email') {
          for (const prospectId of selectedProspects) {
            const { data: contactInfo } = await supabase
              .from('contacts')
              .select('full_name, email')
              .eq('id', prospectId)
              .single();

            const emailContent = await salesGPTService.generateEmailContent(step.emailType, contactInfo, session.user.email);
            
            // Here you would typically send the email using the configured email provider
            console.log(`Generated email for ${contactInfo.full_name}:`, emailContent);
            // Implement email sending logic here using userProfile.email_provider, userProfile.email_api_key, and userProfile.email_domain
          }
        }
      }
      
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
          <ComposeEmail onSend={fetchEmails} userProfile={userProfile} />
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
