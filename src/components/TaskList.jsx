import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, updateTask } from '../services/apiService';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';

export const TaskList = () => {
  const { session } = useSupabaseAuth();
  const queryClient = useQueryClient();
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks', session?.user?.id],
    queryFn: () => fetchTasks(session?.user?.id),
  });

  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', session?.user?.id]);
    },
  });

  const handleUpdateStatus = async (taskId, newStatus) => {
    await updateTaskMutation.mutateAsync({ taskId, updates: { status: newStatus } });
    if (newStatus === 'completed' && currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="text-green-500" />;
      case 'in_progress': return <Clock className="text-yellow-500" />;
      case 'not_started': return <AlertCircle className="text-red-500" />;
      default: return null;
    }
  };

  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error loading tasks: {error.message}</div>;

  const sortedTasks = tasks?.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  const currentTask = sortedTasks?.[currentTaskIndex];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Task Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Progress value={(currentTaskIndex / sortedTasks?.length) * 100} className="w-full" />
          </div>
          {currentTask && (
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{currentTask.title}</h3>
                <Badge className={`${getPriorityColor(currentTask.priority)} text-white`}>
                  {currentTask.priority}
                </Badge>
              </div>
              <p className="text-gray-600 mb-4">{currentTask.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(currentTask.status)}
                  <span className="capitalize">{currentTask.status.replace('_', ' ')}</span>
                </div>
                <div className="space-x-2">
                  <Button
                    onClick={() => handleUpdateStatus(currentTask.id, 'in_progress')}
                    variant="outline"
                  >
                    Start
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus(currentTask.id, 'completed')}
                    variant="default"
                  >
                    Complete
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {currentTaskIndex + 1} of {sortedTasks?.length} tasks
            </span>
            <Button
              onClick={() => setCurrentTaskIndex((prev) => Math.min(prev + 1, sortedTasks.length - 1))}
              disabled={currentTaskIndex === sortedTasks?.length - 1}
            >
              Next Task <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Upcoming Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedTasks?.slice(currentTaskIndex + 1, currentTaskIndex + 4).map((task) => (
              <div key={task.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold">{task.title}</h4>
                  <p className="text-sm text-gray-500">{task.description}</p>
                </div>
                <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                  {task.priority}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
