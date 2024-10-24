import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase';
import SalesCelebrationModal from '@/components/SalesCelebrationModal';
import JobForm from '../components/jobs/JobForm';
import JobList from '../components/jobs/JobList';

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCelebrationModalOpen, setIsCelebrationModalOpen] = useState(false);
  const [celebratingSalesperson, setCelebratingSalesperson] = useState('');
  const queryClient = useQueryClient();

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('jobs').select('*');
      if (error) throw error;
      return data;
    },
  });

  const createJobMutation = useMutation({
    mutationFn: async (newJob) => {
      const { data, error } = await supabase.from('jobs').insert([newJob]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('jobs');
      toast.success('Job created successfully');
      setIsCelebrationModalOpen(true);
      setCelebratingSalesperson('New Salesperson');
    },
    onError: (error) => {
      console.error('Error creating job:', error);
      toast.error('Failed to create job');
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase.from('jobs').update(updates).eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('jobs');
      toast.success('Job updated successfully');
    },
    onError: (error) => {
      console.error('Error updating job:', error);
      toast.error('Failed to update job');
    },
  });

  const handleCreateJob = (newJob) => {
    createJobMutation.mutate(newJob);
  };

  const handleUpdateJobStatus = (jobId, newStatus) => {
    updateJobMutation.mutate({ id: jobId, updates: { status: newStatus } });
  };

  const filteredJobs = jobs?.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.client.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) return <div>Loading jobs...</div>;
  if (error) return <div>Error loading jobs: {error.message}</div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Jobs</h1>
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create New Job</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Job</DialogTitle>
            </DialogHeader>
            <JobForm onSubmit={handleCreateJob} />
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Job List</CardTitle>
        </CardHeader>
        <CardContent>
          <JobList jobs={filteredJobs} onUpdateStatus={handleUpdateJobStatus} />
        </CardContent>
      </Card>
      <SalesCelebrationModal
        isOpen={isCelebrationModalOpen}
        onClose={() => setIsCelebrationModalOpen(false)}
        salesperson={celebratingSalesperson}
      />
    </div>
  );
};

export default Jobs;