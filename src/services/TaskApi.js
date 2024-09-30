// src/services/TaskApi.js

import { supabase } from '../integrations/supabase/supabase';

// Function to fetch total completed tasks by user role 'sales'
export const getTotalCompletedTasksByRole = async () => {
    const { data, error } = await supabase
        .from('tasks')
        .select('id, user_id, status')
        .eq('status', 'done')
        .is('deleted_at', null) // To ensure we only count tasks that aren't marked as deleted
        .eq('user_id', 'sales'); // Ensure to replace this with the actual condition to filter by user role

    if (error) {
        console.error('Error fetching completed tasks:', error);
        return [];
    }
    return data.length; // Return the count of completed tasks
};

// Function to count deleted tasks
export const getDeletedTasksCount = async () => {
    const { data, error } = await supabase
        .from('tasks')
        .select('id')
        .is('deleted_at', 'not', null); // Count tasks where deleted_at is not null

    if (error) {
        console.error('Error fetching deleted tasks count:', error);
        return 0;
    }
    return data.length; // Return the count of deleted tasks
};

// Additional functions for metrics and KPIs can be added here
export const getMetrics = async () => {
    // Add your logic to fetch other metrics or KPIs needed for the dashboard
};

export const getTasksByUserRole = async (role) => {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', role); // Replace with actual condition for user role

    if (error) {
        console.error('Error fetching tasks by user role:', error);
        return [];
    }
    return data; // Return the tasks
};

