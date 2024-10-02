import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/supabase';
import { CheckCircleIcon, ClockIcon } from 'lucide-react';

// Define the steps and their valid transitions
const steps = ['Initial Contact', 'Follow-Up', 'Closing'];
const stepTransitions = {
    "Initial Contact": ["Follow-Up"],
    "Follow-Up": ["Closing"],
    "Closing": [] // No further steps
};

const canTransition = (currentStep, targetStep) => {
    return stepTransitions[currentStep].includes(targetStep);
};

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'To Do', priority: 'Medium', step: 'Initial Contact' });
  const queryClient = useQueryClient();

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tasks')
        .select('*')
        .is('deleted_at', null); // Exclude completed tasks
      if (error) throw error;
      return data;
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (newTask) => {
      const { data, error } = await supabase.from('tasks').insert([newTask]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
      toast.success('Task created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create task: ${error.message}`);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase.from('tasks').update(updates).eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
      toast.success('Task updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update task: ${error.message}`);
    },
  });

  // Handle step transition
  const handleUpdateStep = (taskId, newStep) => {
      const currentStep = tasks.find(task => task.id === taskId).step;
      if (canTransition(currentStep, newStep)) {
          updateTaskMutation.mutate({ id: taskId, updates: { step: newStep } });
      } else {
          toast.error(`Cannot transition from ${currentStep} to ${newStep}`);
      }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    createTaskMutation.mutate(newTask);
    setNewTask({ title: '', description: '', status: 'To Do', priority: 'Medium', step: 'Initial Contact' });
  };

  const filteredTasks = tasks?.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error loading tasks: {error.message}</div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Tasks</h1>
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setShowDialog(true)}>Create New Task</Button>
      </div>
      <form onSubmit={handleCreateTask} className="space-y-4">
        <Input
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        <Input
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <Select
          value={newTask.status}
          onValueChange={(value) => setNewTask({ ...newTask, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="To Do">To Do</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Done">Done</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={newTask.priority}
          onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={newTask.step}
          onValueChange={(value) => setNewTask({ ...newTask, step: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select step" />
          </SelectTrigger>
          <SelectContent>
            {steps.map((step) => (
              <SelectItem key={step} value={step}>{step}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit">Create Task</Button>
      </form>
      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className={`border-l-4 ${task.priority === 'High' ? 'border-l-green-500' : 'border-l-gray-300'} transition-opacity duration-300`}>
            <CardHeader>
              <CardTitle className="flex items-center">
                {task.status === 'Done' ? (
                  <CheckCircleIcon className="text-green-500 mr-2" />
                ) : (
                  <ClockIcon className="text-yellow-500 mr-2" />
                )}
                {task.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{task.description}</p>
              <p className="text-sm text-gray-500">Priority: {task.priority}</p>
              <Select
                value={task.step}
                onValueChange={(value) => handleUpdateStep(task.id, value)}
                className="mt-2"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {steps.map((step) => (
                    <SelectItem key={step} value={step}>{step}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
