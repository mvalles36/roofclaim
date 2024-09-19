import React, { useState, useEffect } from 'react';
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

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const { userRole } = useSupabaseAuth();
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'low',
    assignee_role: '',
    due_date: '',
  });
  const [assignees, setAssignees] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchAssignees();
  }, [userRole]);

  const fetchTasks = async () => {
    let query = supabase.from('tasks').select('*');

    if (userRole !== 'admin' && userRole !== 'project_manager') {
      query = query.eq('assignee_role', userRole);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
    } else {
      setTasks(data);
    }
  };

  const fetchAssignees = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, role');

    if (error) {
      console.error('Error fetching assignees:', error);
    } else {
      setAssignees(data);
    }
  };

  const handleTaskCreated = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .insert([newTask]);

    if (error) {
      console.error('Error creating task:', error);
    } else {
      fetchTasks();
      setNewTask({
        title: '',
        description: '',
        status: 'pending',
        priority: 'low',
        assignee_role: '',
        due_date: '',
      });
    }
  };

  const handleTaskUpdated = async (taskId, updates) => {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId);

    if (error) {
      console.error('Error updating task:', error);
    } else {
      fetchTasks();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Task Management</h1>
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
            <TaskForm
              onTaskCreated={handleTaskCreated}
              assignees={assignees}
              initialTask={newTask}
              onTaskChanged={setNewTask}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Tasks;
