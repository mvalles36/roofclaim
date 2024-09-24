import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from '../integrations/supabase/supabase';

const InsuranceMortgageTracker = () => {
  const [checks, setChecks] = useState([]);
  const [newCheck, setNewCheck] = useState({
    type: 'insurance',
    amount: '',
    status: 'pending',
    contact_id: '',
    job_id: '',
  });
  const [contacts, setContacts] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchChecks();
    fetchContacts();
    fetchJobs();
  }, []);

  const fetchChecks = async () => {
    const { data, error } = await supabase
      .from('insurance_mortgage_checks')
      .select('*, contacts(name), jobs(job_number)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching checks:', error);
      // Implement user-friendly error display in production
    } else {
      setChecks(data);
    }
  };

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select('id, name');

    if (error) {
      console.error('Error fetching contacts:', error);
      // Implement user-friendly error display in production
    } else {
      setContacts(data);
    }
  };

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('id, job_number');

    if (error) {
      console.error('Error fetching jobs:', error);
      // Implement user-friendly error display in production
    } else {
      setJobs(data);
    }
  };

  const handleAddCheck = async () => {
    try {
      const { data, error } = await supabase
        .from('insurance_mortgage_checks')
        .insert([newCheck]);

      if (error) {
        throw error; // Re-throw error for handling
      }

      fetchChecks();
      setNewCheck({
        type: 'insurance',
        amount: '',
        status: 'pending',
        contact_id: '',
        job_id: '',
      });
    } catch (error) {
      console.error('Error adding check:', error);
      // Implement user-friendly error display in production
    }
  };

  const handleUpdateCheckStatus = async (checkId, newStatus) => {
    const { error } = await supabase
      .from('insurance_mortgage_checks')
      .update({ status: newStatus })
      .eq('id', checkId);

    if (error) {
      console.error('Error updating check status:', error);
      // Implement user-friendly error display in production
    } else {
      fetchChecks();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Insurance & Mortgage Check Tracker</h1>
      <Card>
        <CardHeader>
          <CardTitle>Add New Check</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="type">Check Type</Label>
              <Select
                value={newCheck.type}
                onValueChange={(value) => setNewCheck({ ...newCheck, type: value })}
                // Add ARIA attributes for screen reader support
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select check type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="mortgage">Mortgage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={newCheck.amount}
                onChange={(e) => setNewCheck({ ...newCheck, amount: e.target.value })}
                placeholder="Enter check amount"
              />
            </div>
            <div>
              <Label htmlFor="contact">Contact</Label>
              <Select
                value={newCheck.contact_id}
                onValueChange={(value) => setNewCheck({ ...newCheck, contact_id: value })}
                // Add ARIA attributes for screen reader support
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select contact" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>{contact.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="job">Job</Label>
              <Select
                value={newCheck.job_id}
                onValueChange={(value) => setNewCheck({ ...newCheck, job_id: value })}
                // Add ARIA attributes for screen reader support
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>{job.job_number}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddCheck}>Add Check</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Check List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table aria-label="Insurance and Mortgage Check List">
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checks.map((check) => (
                <TableRow key={check.id}>
                  <TableCell>{check.type}</TableCell>
                  <TableCell>${check.amount}</TableCell>
                  <TableCell>{check.contacts.name}</TableCell>
                  <TableCell>{check.jobs.job_number}</TableCell>
                  <TableCell>{check.status}</TableCell>
                  <TableCell>
                    <Select
                      value={check.status}
                      onValueChange={(value) => handleUpdateCheckStatus(check.id, value)}
                      // Add ARIA attributes for screen reader support
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="received">Received</SelectItem>
                        <SelectItem value="deposited">Deposited</SelectItem>
                        <SelectItem value="cleared">Cleared</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsuranceMortgageTracker;
