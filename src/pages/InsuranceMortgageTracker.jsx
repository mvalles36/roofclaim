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
    customer_id: '',
    job_id: '',
  });
  const [customers, setCustomers] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchChecks();
    fetchCustomers();
    fetchJobs();
  }, []);

  const fetchChecks = async () => {
    const { data, error } = await supabase
      .from('insurance_mortgage_checks')
      .select('*, customers(name), jobs(job_number)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching checks:', error);
    } else {
      setChecks(data);
    }
  };

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('id, name');

    if (error) {
      console.error('Error fetching customers:', error);
    } else {
      setCustomers(data);
    }
  };

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('id, job_number');

    if (error) {
      console.error('Error fetching jobs:', error);
    } else {
      setJobs(data);
    }
  };

  const handleAddCheck = async () => {
    const { data, error } = await supabase
      .from('insurance_mortgage_checks')
      .insert([newCheck]);

    if (error) {
      console.error('Error adding check:', error);
    } else {
      fetchChecks();
      setNewCheck({
        type: 'insurance',
        amount: '',
        status: 'pending',
        customer_id: '',
        job_id: '',
      });
    }
  };

  const handleUpdateCheckStatus = async (checkId, newStatus) => {
    const { error } = await supabase
      .from('insurance_mortgage_checks')
      .update({ status: newStatus })
      .eq('id', checkId);

    if (error) {
      console.error('Error updating check status:', error);
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
              <Label htmlFor="customer">Customer</Label>
              <Select
                value={newCheck.customer_id}
                onValueChange={(value) => setNewCheck({ ...newCheck, customer_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="job">Job</Label>
              <Select
                value={newCheck.job_id}
                onValueChange={(value) => setNewCheck({ ...newCheck, job_id: value })}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Customer</TableHead>
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
                  <TableCell>{check.customers.name}</TableCell>
                  <TableCell>{check.jobs.job_number}</TableCell>
                  <TableCell>{check.status}</TableCell>
                  <TableCell>
                    <Select
                      value={check.status}
                      onValueChange={(value) => handleUpdateCheckStatus(check.id, value)}
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