import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import { toast } from 'sonner';

// Hook to manage tasks
const useTasks = () => {
  const queryClient = useQueryClient();
  const [taskToUpdate, setTaskToUpdate] = useState(null);

  // Fetch tasks
  const { data: tasks, isLoading, error } = useQuery(['tasks'], async () => {
    const { data, error } = await supabase.from('tasks').select('*').is('deleted_at', null);
    if (error) throw error;
    return data;
  });

  // Create task
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

  // Update task
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

  // Mark task as done
  const handleMarkAsDone = async (taskId) => {
    await updateTaskMutation.mutate({ id: taskId, updates: { deleted_at: new Date().toISOString() } });
  };

  return {
    tasks,
    isLoading,
    error,
    createTaskMutation,
    updateTaskMutation,
    handleMarkAsDone,
    taskToUpdate,
    setTaskToUpdate,
  };
};

export default useTasks;
