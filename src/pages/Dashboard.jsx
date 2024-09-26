import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Briefcase, FileText } from 'lucide-react';

const Dashboard = () => {
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
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const { data: metricsData, error: metricsError } = await supabase.rpc('get_dashboard_metrics');
    if (metricsError) console.error('Error fetching metrics:', metricsError);
    else setMetrics(metricsData);

    const { data: activitiesData, error: activitiesError } = await supabase.rpc('get_recent_activities');
    if (activitiesError) console.error('Error fetching activities:', activitiesError);
    else setRecentActivities(activitiesData);

    const { data: revenueData, error: revenueError } = await supabase.rpc('get_monthly_revenue');
    if (revenueError) console.error('Error fetching revenue:', revenueError);
    else setMonthlyRevenue(revenueData);

    const { data: jobStatusData, error: jobStatusError } = await supabase.rpc('get_job_status_data');
    if (jobStatusError) console.error('Error fetching job status data:', jobStatusError);
    else setJobStatusData(jobStatusData);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Job Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={jobStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recentActivities.map((activity, index) => (
              <li key={index} className="text-sm">
                {activity.description} - {new Date(activity.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
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
