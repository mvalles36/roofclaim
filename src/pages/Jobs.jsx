import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';

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
    } else {
      setJobs(data);
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