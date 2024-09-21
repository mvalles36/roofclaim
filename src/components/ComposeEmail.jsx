import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/supabase';

const ComposeEmail = ({ onSend }) => {
  const [newEmail, setNewEmail] = useState({ to: '', subject: '', body: '' });

  const handleSendEmail = async () => {
    try {
      const { data, error } = await supabase.from('emails').insert([newEmail]);
      if (error) throw error;
      setNewEmail({ to: '', subject: '', body: '' });
      onSend();
      toast.success('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    }
  };

  return (
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
  );
};

export default ComposeEmail;