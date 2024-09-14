import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { toast } from 'sonner';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newJob, setNewJob] = useState({
    customer_id: '',
    job_type: '',
    roof_type: '',
    job_status: 'Pending',
    job_cost_estimate: '',
    start_date: '',
    assigned_crew: '',
    job_notes: ''
  });
  const { userRole } = useSupabaseAuth();

  useEffect(() => {
    fetchJobs();
    fetchCustomers();
  }, []);

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*, customers(full_name)')
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    } else {
      setJobs(data);
    }
  };

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('id, full_name');

    if (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
    } else {
      setCustomers(data);
    }
  };

  const handleCreateJob = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .insert([newJob]);

    if (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create job');
    } else {
      toast.success('Job created successfully');
      fetchJobs();
      setNewJob({
        customer_id: '',
        job_type: '',
        roof_type: '',
        job_status: 'Pending',
        job_cost_estimate: '',
        start_date: '',
        assigned_crew: '',
        job_notes: ''
      });
    }
  };

  const handleUpdateJobStatus = async (jobId, newStatus) => {
    const { error } = await supabase
      .from('jobs')
      .update({ job_status: newStatus })
      .eq('id', jobId);

    if (error) {
      console.error('Error updating job status:', error);
      toast.error('Failed to update job status');
    } else {
      fetchJobs();
      toast.success('Job status updated successfully');
      if (newStatus === 'Completed') {
        await createInvoice(jobId);
      }
    }
  };

  const createInvoice = async (jobId) => {
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError) {
      console.error('Error fetching job details:', jobError);
      toast.error('Failed to create invoice');
      return;
    }

    const { error: invoiceError } = await supabase
      .from('invoices')
      .insert([{
        customer_id: job.customer_id,
        job_id: job.id,
        amount_due: job.job_cost_estimate,
        payment_status: 'Unpaid',
        invoice_date: new Date().toISOString(),
        payment_due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Due in 30 days
      }]);

    if (invoiceError) {
      console.error('Error creating invoice:', invoiceError);
      toast.error('Failed to create invoice');
    } else {
      toast.success('Invoice created successfully');
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.customers.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.job_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Jobs</h1>
      <Input
        placeholder="Search jobs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <Dialog>
        <DialogTrigger asChild>
          <Button>Create New Job</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Job</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select onValueChange={(value) => setNewJob({ ...newJob, customer_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>{customer.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Job Type"
              value={newJob.job_type}
              onChange={(e) => setNewJob({ ...newJob, job_type: e.target.value })}
            />
            <Input
              placeholder="Roof Type"
              value={newJob.roof_type}
              onChange={(e) => setNewJob({ ...newJob, roof_type: e.target.value })}
            />
            <Input
              placeholder="Job Cost Estimate"
              type="number"
              value={newJob.job_cost_estimate}
              onChange={(e) => setNewJob({ ...newJob, job_cost_estimate: e.target.value })}
            />
            <Input
              placeholder="Start Date"
              type="date"
              value={newJob.start_date}
              onChange={(e) => setNewJob({ ...newJob, start_date: e.target.value })}
            />
            <Input
              placeholder="Assigned Crew"
              value={newJob.assigned_crew}
              onChange={(e) => setNewJob({ ...newJob, assigned_crew: e.target.value })}
            />
            <Input
              placeholder="Job Notes"
              value={newJob.job_notes}
              onChange={(e) => setNewJob({ ...newJob, job_notes: e.target.value })}
            />
            <Button onClick={handleCreateJob}>Create Job</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Card>
        <CardHeader>
          <CardTitle>Job List</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {filteredJobs.map((job) => (
              <li key={job.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{job.customers.full_name}</p>
                  <p>Job Type: {job.job_type}</p>
                  <p>Status: {job.job_status}</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>View Details</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Job Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                      <p><strong>Customer:</strong> {job.customers.full_name}</p>
                      <p><strong>Job Type:</strong> {job.job_type}</p>
                      <p><strong>Roof Type:</strong> {job.roof_type}</p>
                      <p><strong>Status:</strong> {job.job_status}</p>
                      <p><strong>Estimate:</strong> ${job.job_cost_estimate}</p>
                      <p><strong>Actual Cost:</strong> ${job.actual_job_cost}</p>
                      <p><strong>Start Date:</strong> {new Date(job.start_date).toLocaleDateString()}</p>
                      <p><strong>End Date:</strong> {job.end_date ? new Date(job.end_date).toLocaleDateString() : 'Not completed'}</p>
                      <p><strong>Assigned Crew:</strong> {job.assigned_crew}</p>
                      <p><strong>Notes:</strong> {job.job_notes}</p>
                      <Select
                        value={job.job_status}
                        onValueChange={(value) => handleUpdateJobStatus(job.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Jobs;
