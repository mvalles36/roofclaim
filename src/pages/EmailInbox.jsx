import React from 'react';
import EmailInbox from '../components/EmailInbox';

const EmailInboxPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Email Inbox</h1>
      <EmailInbox />
    </div>
  );
};

export default EmailInboxPage;