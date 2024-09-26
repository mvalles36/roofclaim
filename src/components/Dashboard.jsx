import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { fetchTaskStatistics } from '../services/apiService';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CheckCircle, Clock, AlertCircle, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const { session, userRole } = useSupabaseAuth();

  const { data: taskStats, isLoading, error } = useQuery({
    queryKey: ['taskStatistics', session?.user?.id, userRole],
    queryFn: () => fetchTaskStatistics(session?.user?.id, userRole === 'sales_manager'),
  });

  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error loading dashboard: {error.message}</div>;

  const chartData = [
    { name: 'Completed', value: taskStats.completed_tasks },
    { name: 'In Progress', value: taskStats.in_progress_tasks },
    { name: 'Not Started', value: taskStats.not_started_tasks },
    { name: 'Overdue', value: taskStats.overdue_tasks },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={taskStats.total_tasks}
          icon={<CheckCircle className="h-8 w-8 text-blue-500" />}
        />
        <StatCard
          title="Completed Tasks"
          value={taskStats.completed_tasks}
          icon={<CheckCircle className="h-8 w-8 text-green-500" />}
        />
        <StatCard
          title="In Progress Tasks"
          value={taskStats.in_progress_tasks}
          icon={<Clock className="h-8 w-8 text-yellow-500" />}
        />
        <StatCard
          title="Overdue Tasks"
          value={taskStats.overdue_tasks}
          icon={<AlertTriangle className="h-8 w-8 text-red-500" />}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Task Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
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
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export default Dashboard;
