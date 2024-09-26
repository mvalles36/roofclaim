import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem } from "@/components/ui/select"; // Removed unused imports
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
            <Button variant="outline">
              <Plus className="mr-2" />
              Add Sequence
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Sequence</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Sequence Name"
                value={newSequence.name}
                onChange={(e) => setNewSequence({ ...newSequence, name: e.target.value })}
              />
              {newSequence.steps.map((step, index) => (
                <div key={index} className="border p-4 rounded">
                  <Select
                    value={step.email.type}
                    onValueChange={(value) => handleUpdateSequenceStep(index, 'email.type', value)}
                  >
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="introduction">Introduction</SelectItem>
                  </Select>
                  <Input
                    placeholder="Email Subject"
                    value={step.email.subject}
                    onChange={(e) => handleUpdateSequenceStep(index, 'email.subject', e.target.value)}
                  />
                  <Textarea
                    placeholder="Email Body"
                    value={step.email.body}
                    onChange={(e) => handleUpdateSequenceStep(index, 'email.body', e.target.value)}
                  />
                  <div className="flex items-center">
                    <Input
                      type="number"
                      min="0"
                      placeholder="Wait Days"
                      value={step.waitDays}
                      onChange={(e) => handleUpdateSequenceStep(index, 'waitDays', e.target.value)}
                    />
                    <Button onClick={() => handleAIWriteEmail(index)}>Generate Email</Button>
                  </div>
                </div>
              ))}
              <Button onClick={handleAddSequenceStep}>Add Step</Button>
            </div>
            <Button onClick={() => { onSaveSequence(newSequence); setNewSequence({ name: '', steps: [] }); }}>Save Sequence</Button>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default EmailSequenceBuilder;
