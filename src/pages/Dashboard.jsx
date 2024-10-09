import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Briefcase, FileText } from 'lucide-react';
import { useUser } from '../context/UserContext'; // This import is now correct
import { supabase } from '../integrations/supabase/supabase';
import {
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const user = useUser(); // Use the custom hook
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalContacts: 0,
    totalJobs: 0,
    totalInvoices: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [jobStatusData, setJobStatusData] = useState([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]); // Update the dependency to user

  const fetchDashboardData = async () => {
    try {
      // Use the user's UUID to fetch data specific to them
      const { data: metricsData, error: metricsError } = await supabase.rpc('get_dashboard_metrics', { user_id: user.id });
      if (metricsError) throw new Error(metricsError.message);
      setMetrics(metricsData);
      
      const { data: activitiesData, error: activitiesError } = await supabase.rpc('get_recent_activities', { user_id: user.id });
      if (activitiesError) throw new Error(activitiesError.message);
      setRecentActivities(activitiesData);
      
      const { data: revenueData, error: revenueError } = await supabase.rpc('get_monthly_revenue', { user_id: user.id });
      if (revenueError) throw new Error(revenueError.message);
      setMonthlyRevenue(revenueData);
      
      const { data: jobStatusData, error: jobStatusError } = await supabase.rpc('get_job_status_data', { user_id: user.id });
      if (jobStatusError) throw new Error(jobStatusError.message);
      setJobStatusData(jobStatusData);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Optionally set an error state here to display to the user
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Revenue" value={`$${metrics.totalRevenue.toFixed(2)}`} icon={<DollarSign className="h-8 w-8 text-green-500" />} />
        <MetricCard title="Total Contacts" value={metrics.totalContacts} icon={<Users className="h-8 w-8 text-blue-500" />} />
        <MetricCard title="Total Jobs" value={metrics.totalJobs} icon={<Briefcase className="h-8 w-8 text-yellow-500" />} />
        <MetricCard title="Total Invoices" value={metrics.totalInvoices} icon={<FileText className="h-8 w-8 text-purple-500" />} />
      </div>

      {/* Render charts */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold">Monthly Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-bold">Job Status Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={jobStatusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activities */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold">Recent Activities</h2>
        <ul className="space-y-2">
          {recentActivities.map((activity, index) => (
            <li key={index} className="border p-2 rounded-md">
              <span>{activity.description}</span> - <span className="text-gray-500">{new Date(activity.date).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon }) => (
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