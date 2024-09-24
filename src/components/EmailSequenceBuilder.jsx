import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { generateAIResponse } from '../utils/openAIClient';

const EmailSequenceBuilder = ({ sequences, contacts, onSaveSequence, onStartSequence }) => {
  const [newSequence, setNewSequence] = useState({ name: '', steps: [] });
  const [selectedContacts, setSelectedContacts] = useState([]);

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

  const handleAIWriteEmail = async (index) => {
    toast.info('AI is generating an email...');
    try {
      const prompt = `Write a professional email for a roofing company's email sequence. The email should be persuasive and encourage the recipient to consider our roofing services. Include a subject line and body.`;
      const response = await generateAIResponse(prompt);
      const [subject, ...bodyParts] = response.split('\n');
      const body = bodyParts.join('\n').trim();
      
      handleUpdateSequenceStep(index, 'email.subject', subject.replace('Subject: ', ''));
      handleUpdateSequenceStep(index, 'email.body', body);
      toast.success('AI has generated an email draft');
    } catch (error) {
      console.error('Error generating AI email:', error);
      toast.error('Failed to generate AI email');
    }
  };

  return (
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
          <DialogContent className="max-w-4xl">
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
                  <h3 className="font-semibold">Step {index + 1}</h3>
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
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <Input
                      type="number"
                      placeholder="Wait Days"
                      value={step.waitDays}
                      onChange={(e) => handleUpdateSequenceStep(index, 'waitDays', parseInt(e.target.value))}
                      className="w-24"
                    />
                    <span>days</span>
                  </div>
                  <Button onClick={() => handleAIWriteEmail(index)}>Ask AI to Write Email</Button>
                </div>
              ))}
              <Button onClick={handleAddSequenceStep}>
                <Plus className="mr-2 h-4 w-4" /> Add Step
              </Button>
              <Button onClick={() => onSaveSequence(newSequence)}>Save Sequence</Button>
            </div>
          </DialogContent>
        </Dialog>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Existing Sequences</h3>
          {sequences.map((sequence) => (
            <div key={sequence.id} className="flex items-center justify-between border p-4 rounded mb-2">
              <span>{sequence.name}</span>
              <Button onClick={() => onStartSequence(sequence.id, selectedContacts)}>Start Sequence</Button>
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
  );
};

export default EmailSequenceBuilder;
