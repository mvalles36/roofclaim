import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const SupplementInbox = () => {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    // In a real application, you'd integrate with an email API
    // For now, we'll use dummy data
    const dummyEmails = [
      { id: 1, subject: 'RE: Claim #123456 - Supplement Request', status: 'Opened', date: '2024-03-20' },
      { id: 2, subject: 'Claim #789012 - Additional Information Needed', status: 'In Review', date: '2024-03-19' },
      { id: 3, subject: 'Approved: Supplement for Claim #345678', status: 'Approved', date: '2024-03-18' },
    ];
    setEmails(dummyEmails);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supplement Inbox</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emails.map((email) => (
              <TableRow key={email.id}>
                <TableCell>{email.subject}</TableCell>
                <TableCell>{email.status}</TableCell>
                <TableCell>{email.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
