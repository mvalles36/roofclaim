import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchContactTasks, createTask, updateTask } from '../services/apiService';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const ContactView = ({ contactId }) => {
  const { session } = useSupabaseAuth(); // Ensure session is being used
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' });

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['contactTasks', contactId],
    queryFn: () => fetchContactTasks(contactId),
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries(['contactTasks', contactId]);
      setNewTask({ title: '', description: '', priority: 'medium' });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries(['contactTasks', contactId]);
    },
  });

  const handleCreateTask = async (e) => {
    e.preventDefault();
    await createTaskMutation.mutateAsync({
      ...newTask,
      contact_id: contactId,
      user_id: session?.user?.id,
    });
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    await updateTaskMutation.mutateAsync({ taskId, updates: { status: newStatus } });
  };

  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error loading tasks: {error.message}</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateTask} className="space-y-4 mb-6">
            <div>
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={newTask.priority}
                onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </form>
          <div className="space-y-4">
            {tasks?.map((task) => (
              <Card key={task.id}>
                <CardContent className="flex justify-between items-center p-4">
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-gray-500">{task.description}</p>
                    <p className="text-sm">Priority: {task.priority}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleUpdateStatus(task.id, 'completed')}
                      size="sm"
                      variant={task.status === 'completed' ? 'default' : 'outline'}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleUpdateStatus(task.id, 'in_progress')}
                      size="sm"
                      variant={task.status === 'in_progress' ? 'default' : 'outline'}
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleUpdateStatus(task.id, 'not_started')}
                      size="sm"
                      variant={task.status === 'not_started' ? 'default' : 'outline'}
                    >
                      <AlertCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactView;
