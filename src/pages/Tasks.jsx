import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { TaskList } from '../components/TaskList';
import { TaskForm } from '../components/TaskForm';
import TaskKanban from '../components/TaskKanban';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Tasks = () => {
  const [viewMode, setViewMode] = useState('list');
  const { userRole } = useSupabaseAuth();
  const queryClient = useQueryClient();

  const fetchTasks = async () => {
    let query = supabase.from('tasks').select('*');
    if (userRole !== 'admin' && userRole !== 'project_manager') {
      query = query.eq('assignee_role', userRole);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  };

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  const createTaskMutation = useMutation({
    mutationFn: async (newTask) => {
      const { data, error } = await supabase.from('tasks').insert([newTask]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, updates }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });

  const handleTaskCreated = async (newTask) => {
    await createTaskMutation.mutateAsync(newTask);
  };

  const handleTaskUpdated = async (taskId, updates) => {
    await updateTaskMutation.mutateAsync({ taskId, updates });
  };

  const taskStats = tasks ? {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(task => task.status === 'Completed').length,
    pendingTasks: tasks.filter(task => task.status !== 'Completed').length,
  } : { totalTasks: 0, completedTasks: 0, pendingTasks: 0 };

  const taskCompletionData = [
    { name: 'Completed', value: taskStats.completedTasks },
    { name: 'Pending', value: taskStats.pendingTasks },
  ];

  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error loading tasks: {error.message}</div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Task Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{taskStats.totalTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-500">{taskStats.completedTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-yellow-500">{taskStats.pendingTasks}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Task Completion Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskCompletionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Tabs value={viewMode} onValueChange={setViewMode}>
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <TaskList tasks={tasks} onTaskUpdated={handleTaskUpdated} />
        </TabsContent>
        <TabsContent value="kanban">
          <TaskKanban tasks={tasks} onTaskUpdated={handleTaskUpdated} />
        </TabsContent>
      </Tabs>
      {(userRole === 'admin' || userRole === 'project_manager') && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm onTaskCreated={handleTaskCreated} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Tasks;
