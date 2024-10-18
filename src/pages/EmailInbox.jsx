import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmailInbox from '../components/EmailInbox';
import ComposeEmail from '../components/ComposeEmail';

const EmailInboxPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Email Inbox</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Inbox</CardTitle>
            </CardHeader>
            <CardContent>
              <EmailInbox />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Compose Email</CardTitle>
            </CardHeader>
            <CardContent>
              <ComposeEmail onSend={(email) => console.log('Sent email:', email)} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmailInboxPage;