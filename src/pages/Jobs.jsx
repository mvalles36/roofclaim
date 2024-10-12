import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/supabase';
import SalesCelebrationModal from '../components/SalesCelebrationModal';

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newJob, setNewJob] = useState({ title: '', client: '', status: 'Pending' });
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
    onSuccess: (data) => {
      queryClient.invalidateQueries('jobs');
      toast.success('Job created successfully');
      setIsCelebrationModalOpen(true);
      setCelebratingSalesperson('New Salesperson'); // Replace with actual salesperson name
    },
    onError: (error) => {
      toast.error(`Failed to create job: ${error.message}`);
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
      toast.error(`Failed to update job: ${error.message}`);
    },
  });

  const handleCreateJob = async (e) => {
    e.preventDefault();
    createJobMutation.mutate(newJob);
    setNewJob({ title: '', client: '', status: 'Pending' });
  };

  const handleUpdateJobStatus = async (jobId, newStatus) => {
    updateJobMutation.mutate({ id: jobId, updates: { status: newStatus } });
  };

  const filteredJobs = jobs?.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.client.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  useEffect(() => {
    const channel = supabase
      .channel('job-created')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'jobs',
      }, (payload) => {
        setIsCelebrationModalOpen(true);
        setCelebratingSalesperson('New Salesperson'); // Replace with actual salesperson name
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
            <form onSubmit={handleCreateJob} className="space-y-4">
              <Input
                placeholder="Job Title"
                value={newJob.title}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                required
              />
              <Input
                placeholder="Client"
                value={newJob.client}
                onChange={(e) => setNewJob({ ...newJob, client: e.target.value })}
                required
              />
              <Select
                value={newJob.status}
                onValueChange={(value) => setNewJob({ ...newJob, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit">Create Job</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Job List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.title}</TableCell>
                  <TableCell>{job.client}</TableCell>
                  <TableCell>{job.status}</TableCell>
                  <TableCell>
                    <Select
                      value={job.status}
                      onValueChange={(value) => handleUpdateJobStatus(job.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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