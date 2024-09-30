import axios from 'axios';

const API_URL = 'services/api'; // Replace with your actual API URL

const TaskApi = {
  // Fetch all tasks
  getAllTasks: async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Fetch a specific task by ID
  getTaskById: async (taskId) => {
    try {
      const response = await axios.get(`${API_URL}/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${taskId}:`, error);
      throw error;
    }
  },

  // Create a new task
  createTask: async (taskData) => {
    try {
      const response = await axios.post(`${API_URL}/tasks`, taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update an existing task
  updateTask: async (taskId, taskData) => {
    try {
      const response = await axios.put(`${API_URL}/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error(`Error updating task with ID ${taskId}:`, error);
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (taskId) => {
    try {
      const response = await axios.delete(`${API_URL}/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting task with ID ${taskId}:`, error);
      throw error;
    }
  },

  // Fetch tasks based on status
  getTasksByStatus: async (status) => {
    try {
      const response = await axios.get(`${API_URL}/tasks?status=${status}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tasks with status ${status}:`, error);
      throw error;
    }
  },
  
  // Fetch tasks for a specific user
  getTasksByUserId: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/tasks?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tasks for user ID ${userId}:`, error);
      throw error;
    }
  },
};

export default TaskApi;

