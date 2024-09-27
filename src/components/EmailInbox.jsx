import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const EmailInbox = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newEmail, setNewEmail] = useState({ to: '', subject: '', body: '' });
  const queryClient = useQueryClient();

  const { data: emails, isLoading, error } = useQuery({
    queryKey: ['emails'],
    queryFn: async () => {
      const { data, error } = await supabase.from('emails').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const sendEmailMutation = useMutation({
    mutationFn: async (newEmail) => {
      // In a real application, you would integrate with an email service here
      const { data, error } = await supabase.from('emails').insert([{ ...newEmail, status: 'sent' }]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('emails');
      toast.success('Email sent successfully');
    },
    onError: (error) => {
      toast.error(`Failed to send email: ${error.message}`);
    },
  });

  const handleSendEmail = async (e) => {
    e.preventDefault();
    sendEmailMutation.mutate(newEmail);
    setNewEmail({ to: '', subject: '', body: '' });
  };

  const filteredEmails = emails?.filter(email =>
    email.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.subject.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) return <div>Loading emails...</div>;
  if (error) return <div>Error loading emails: {error.message}</div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Email Inbox</h1>
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search emails..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button>Compose Email</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Compose New Email</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSendEmail} className="space-y-4">
              <Input
                placeholder="To"
                value={newEmail.to}
                onChange={(e) => setNewEmail({ ...newEmail, to: e.target.value })}
                required
              />
              <Input
                placeholder="Subject"
                value={newEmail.subject}
                onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
                required
              />
              <Textarea
                placeholder="Email body"
                value={newEmail.body}
                onChange={(e) => setNewEmail({ ...newEmail, body: e.target.value })}
                required
              />
              <Button type="submit">Send Email</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>To</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmails.map((email) => (
                <TableRow key={email.id}>
                  <TableCell>{email.to}</TableCell>
                  <TableCell>{email.subject}</TableCell>
                  <TableCell>{email.status}</TableCell>
                  <TableCell>{new Date(email.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailInbox;