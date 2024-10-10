import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Simulated task service (replace with actual API calls in a real application)
const taskService = {
  fetchTasks: async () => {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  },
  createTask: async (newTask) => {
    const tasks = await taskService.fetchTasks();
    const updatedTasks = [...tasks, { ...newTask, id: Date.now().toString() }];
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    return newTask;
  },
  updateTask: async ({ id, updates }) => {
    const tasks = await taskService.fetchTasks();
    const updatedTasks = tasks.map(task => task.id === id ? { ...task, ...updates } : task);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    return updatedTasks.find(task => task.id === id);
  },
  deleteTask: async (id) => {
    const tasks = await taskService.fetchTasks();
    const updatedTasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  }
};

// Hook to manage tasks
const useTasks = () => {
  const queryClient = useQueryClient();
  const [taskToUpdate, setTaskToUpdate] = useState(null);

  // Fetch tasks
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskService.fetchTasks
  });

  // Create task
  const createTaskMutation = useMutation({
    mutationFn: taskService.createTask,
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
    mutationFn: taskService.updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
      toast.success('Task updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update task: ${error.message}`);
    },
  });

  // Delete task
  const deleteTaskMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
      toast.success('Task deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete task: ${error.message}`);
    },
  });

  // Mark task as done
  const handleMarkAsDone = async (taskId) => {
    await updateTaskMutation.mutateAsync({ id: taskId, updates: { status: 'completed' } });
  };

  return {
    tasks,
    isLoading,
    error,
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
    handleMarkAsDone,
    taskToUpdate,
    setTaskToUpdate,
  };
};

export default useTasks;