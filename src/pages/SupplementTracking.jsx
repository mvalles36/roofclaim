import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/supabase';

const SupplementTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newSupplement, setNewSupplement] = useState({ jobId: '', description: '', amount: 0, status: 'Pending' });
  const queryClient = useQueryClient();

  const { data: supplements, isLoading, error } = useQuery({
    queryKey: ['supplements'],
    queryFn: async () => {
      const { data, error } = await supabase.from('supplements').select('*');
      if (error) throw error;
      return data;
    },
  });

  const createSupplementMutation = useMutation({
    mutationFn: async (newSupplement) => {
      const { data, error } = await supabase.from('supplements').insert([newSupplement]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('supplements');
      toast.success('Supplement created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create supplement: ${error.message}`);
    },
  });

  const updateSupplementMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase.from('supplements').update(updates).eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('supplements');
      toast.success('Supplement updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update supplement: ${error.message}`);
    },
  });

  const handleCreateSupplement = async (e) => {
    e.preventDefault();
    createSupplementMutation.mutate(newSupplement);
    setNewSupplement({ jobId: '', description: '', amount: 0, status: 'Pending' });
  };

  const handleUpdateSupplementStatus = async (supplementId, newStatus) => {
    updateSupplementMutation.mutate({ id: supplementId, updates: { status: newStatus } });
  };

  const filteredSupplements = supplements?.filter(supplement =>
    supplement.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplement.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) return <div>Loading supplements...</div>;
  if (error) return <div>Error loading supplements: {error.message}</div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Supplement Tracking</h1>
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search supplements..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create New Supplement</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Supplement</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSupplement} className="space-y-4">
              <Input
                placeholder="Job ID"
                value={newSupplement.jobId}
                onChange={(e) => setNewSupplement({ ...newSupplement, jobId: e.target.value })}
                required
              />
              <Input
                placeholder="Description"
                value={newSupplement.description}
                onChange={(e) => setNewSupplement({ ...newSupplement, description: e.target.value })}
                required
              />
              <Input
                type="number"
                placeholder="Amount"
                value={newSupplement.amount}
                onChange={(e) => setNewSupplement({ ...newSupplement, amount: parseFloat(e.target.value) })}
                required
              />
              <Select
                value={newSupplement.status}
                onValueChange={(value) => setNewSupplement({ ...newSupplement, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit">Create Supplement</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Supplement List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSupplements.map((supplement) => (
                <TableRow key={supplement.id}>
                  <TableCell>{supplement.jobId}</TableCell>
                  <TableCell>{supplement.description}</TableCell>
                  <TableCell>${supplement.amount.toFixed(2)}</TableCell>
                  <TableCell>{supplement.status}</TableCell>
                  <TableCell>
                    <Select
                      value={supplement.status}
                      onValueChange={(value) => handleUpdateSupplementStatus(supplement.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
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

export default SupplementTracking;