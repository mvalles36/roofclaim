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
import { EmailService } from '../services/EmailService';

const EmailSequenceBuilder = ({ onSaveSequence, onStartSequence }) => {
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

  const handleSaveSequence = async () => {
    try {
      await EmailService.saveSequence(newSequence);
      onSaveSequence(newSequence);
      setNewSequence({ name: '', steps: [] });
      toast.success('Sequence saved successfully');
    } catch (error) {
      console.error('Error saving sequence:', error);
      toast.error('Failed to save sequence');
    }
  };

  const handleStartSequence = async () => {
    try {
      await EmailService.startSequence(newSequence.id, selectedContacts);
      onStartSequence(newSequence.id, selectedContacts);
      toast.success('Sequence started successfully');
    } catch (error) {
      console.error('Error starting sequence:', error);
      toast.error('Failed to start sequence');
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
                  <div className="flex items-center mt-2">
                    <Input
                      type="number"
                      min="0"
                      placeholder="Wait Days"
                      value={step.waitDays}
                      onChange={(e) => handleUpdateSequenceStep(index, 'waitDays', parseInt(e.target.value))}
                    />
                    <Button onClick={() => handleAIWriteEmail(index)} className="ml-2">Generate Email</Button>
                  </div>
                </div>
              ))}
              <Button onClick={handleAddSequenceStep}>Add Step</Button>
            </div>
            <Button onClick={handleSaveSequence}>Save Sequence</Button>
          </DialogContent>
        </Dialog>
        <Button onClick={handleStartSequence} className="mt-4">Start Sequence</Button>
      </CardContent>
    </Card>
  );
};

export default EmailSequenceBuilder;