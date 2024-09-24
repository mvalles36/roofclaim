import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from '../integrations/supabase/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*, contacts(id, full_name, email)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    }
  };

  const createJobPortal = async (job) => {
    try {
      // Check if job portal already exists
      const { data: existingPortal, error: portalError } = await supabase
        .from('job_portals')
        .select('id')
        .eq('contact_id', job.contacts.id)
        .single();

      if (portalError && portalError.code !== 'PGRST116') throw portalError;

      if (!existingPortal) {
        // Create new job portal
        const { data: newPortal, error: createError } = await supabase
          .from('job_portals')
          .insert({ contact_id: job.contacts.id, job_id: job.id })
          .single();

        if (createError) throw createError;

        // Generate temporary password
        const tempPassword = Math.random().toString(36).slice(-8);

        // Create auth user
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email: job.contacts.email,
          password: tempPassword,
          email_confirm: true,
        });

        if (authError) throw authError;

        // Send email with login information
        await sendJobPortalEmail(job.contacts.email, tempPassword);

        toast.success('Job portal created and email sent');
      } else {
        toast.info('Job portal already exists for this contact');
      }

      // Navigate to the job portal
      navigate(`/job-portal/${job.contacts.id}`);
    } catch (error) {
      console.error('Error creating job portal:', error);
      toast.error('Failed to create job portal');
    }
  };

  const sendJobPortalEmail = async (email, password) => {
    // Implement email sending logic here
    console.log(`Sending email to ${email} with password: ${password}`);
    // In a real implementation, you would use a service like SendGrid or AWS SES
  };

  const filteredJobs = jobs.filter(job =>
    job.contacts.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.job_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact Name</TableHead>
                <TableHead>Job Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.contacts.full_name}</TableCell>
                  <TableCell>{job.job_type}</TableCell>
                  <TableCell>{job.status}</TableCell>
                  <TableCell>{new Date(job.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button onClick={() => createJobPortal(job)}>
                      Create/View Job Portal
                    </Button>
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

export default Jobs;
