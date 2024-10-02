import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import useTasks from '../hooks/useTasks';
import { CheckCircleIcon, ClockIcon } from 'lucide-react';

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'To Do', priority: 'Medium' });

  const {
    tasks,
    isLoading,
    error,
    createTaskMutation,
    updateTaskMutation,
    handleMarkAsDone,
  } = useTasks();

  const handleCreateTask = async (e) => {
    e.preventDefault();
    createTaskMutation.mutate(newTask);
    setNewTask({ title: '', description: '', status: 'To Do', priority: 'Medium' });
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
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create New Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
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
              <Button type="submit">Create Task</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
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
                value={task.status}
                onValueChange={(value) => updateTaskMutation.mutate({ id: task.id, updates: { status: value } })}
                className="mt-2"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => handleMarkAsDone(task.id)}>Mark as Done</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
