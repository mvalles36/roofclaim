import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const JobForm = ({ onSubmit }) => {
  const [newJob, setNewJob] = useState({ title: '', client: '', status: 'Pending' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newJob);
    setNewJob({ title: '', client: '', status: 'Pending' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
  );
};

export default JobForm;