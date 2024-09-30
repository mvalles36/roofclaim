import { supabase } from '../integrations/supabase/supabase';

const TaskApi = {
  getTasks: async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching tasks: ${error.message}`);
    }
    return data;
  },

  addTask: async (task) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task]);

    if (error) {
      throw new Error(`Error adding task: ${error.message}`);
    }
    return data;
  },

  updateTask: async (taskId, updates) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId);

    if (error) {
      throw new Error(`Error updating task: ${error.message}`);
    }
    return data;
  },

  deleteTask: async (taskId) => {
    const { data, error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      throw new Error(`Error deleting task: ${error.message}`);
    }
    return data;
  },

  // Add more methods as needed
};

export default TaskApi;
