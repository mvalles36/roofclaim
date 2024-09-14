import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { toast } from 'sonner';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { userRole } = useSupabaseAuth();

  useEffect(() => {
    fetchJobs();
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
                      <select
                        value={job.job_status}
                        onChange={(e) => handleUpdateJobStatus(job.id, e.target.value)}
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
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
