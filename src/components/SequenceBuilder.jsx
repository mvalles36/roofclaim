import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Mail, Phone, CheckSquare } from 'lucide-react';

const SequenceBuilder = ({ onSaveSequence }) => { // Removed onStartSequence as it's not used
  const [sequence, setSequence] = useState({ name: '', steps: [] });

  const addStep = (type) => {
    setSequence(prev => ({
      ...prev,
      steps: [...prev.steps, { type, content: '', waitDays: 1 }]
    }));
  };

  const updateStep = (index, field, value) => {
    setSequence(prev => {
      const newSteps = [...prev.steps];
      newSteps[index] = { ...newSteps[index], [field]: value };
      return { ...prev, steps: newSteps };
    });
  };

  const handleSave = () => {
    onSaveSequence(sequence);
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Sequence Name"
        value={sequence.name}
        onChange={(e) => setSequence(prev => ({ ...prev, name: e.target.value }))}
      />
      {sequence.steps.map((step, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{step.type === 'email' ? 'Email' : step.type === 'call' ? 'Phone Call' : 'Task'}</CardTitle>
          </CardHeader>
          <CardContent>
            {step.type === 'email' && (
              <Textarea
                placeholder="Email content"
                value={step.content}
                onChange={(e) => updateStep(index, 'content', e.target.value)}
              />
            )}
            {step.type === 'call' && (
              <div>
                <Select onValueChange={(value) => updateStep(index, 'callType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Call Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="ai">AI</SelectItem>
                  </SelectContent>
                </Select>
                {step.callType === 'ai' && (
                  <Textarea
                    placeholder="AI Call Script"
                    value={step.content}
                    onChange={(e) => updateStep(index, 'content', e.target.value)}
                  />
                )}
              </div>
            )}
            {step.type === 'task' && (
              <Input
                placeholder="Task description"
                value={step.content}
                onChange={(e) => updateStep(index, 'content', e.target.value)}
              />
            )}
            <div className="mt-2">
              <Input
                type="number"
                placeholder="Wait days"
                value={step.waitDays}
                onChange={(e) => updateStep(index, 'waitDays', parseInt(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="flex space-x-2">
        <Button onClick={() => addStep('email')}><Mail className="mr-2" /> Add Email</Button>
        <Button onClick={() => addStep('call')}><Phone className="mr-2" /> Add Call</Button>
        <Button onClick={() => addStep('task')}><CheckSquare className="mr-2" /> Add Task</Button>
      </div>
      <Button onClick={handleSave}>Save Sequence</Button>
    </div>
  );
};

export default SequenceBuilder;
