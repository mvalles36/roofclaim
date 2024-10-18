import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const TaskForm = ({ onTaskCreated, onClose }) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    due_date: '',
    assignee_role: '',
    status: 'To-Do'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onTaskCreated(task);
    setTask({
      title: '',
      description: '',
      priority: 'Medium',
      due_date: '',
      assignee_role: '',
      status: 'To-Do'
    });
    onClose(); // Close the modal after submission
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" value={task.title} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={task.description} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select name="priority" value={task.priority} onValueChange={(value) => setTask(prev => ({ ...prev, priority: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="due_date">Due Date</Label>
        <Input id="due_date" name="due_date" type="date" value={task.due_date} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="assignee_role">Assignee Role</Label>
        <Select name="assignee_role" value={task.assignee_role} onValueChange={(value) => setTask(prev => ({ ...prev, assignee_role: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select assignee role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="roofing_crew">Roofing Crew</SelectItem>
            <SelectItem value="supplement_specialist">Supplement Specialist</SelectItem>
            <SelectItem value="project_manager">Project Manager</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Create Task</Button>
    </form>
  );
};