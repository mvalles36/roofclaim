import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { userRole } = useSupabaseAuth();
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    totalCustomers: 0,
    totalJobs: 0,
    totalRevenue: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: metricsData, error: metricsError } = await supabase.rpc('get_dashboard_metrics');
      if (metricsError) throw new Error('Error fetching metrics:', metricsError.message);
      setMetrics(metricsData);

      const { data: activitiesData, error: activitiesError } = await supabase.rpc('get_recent_activities');
      if (activitiesError) throw new Error('Error fetching activities:', activitiesError.message);
      setRecentActivities(activitiesData);

      const { data: revenueData, error: revenueError } = await supabase.rpc('get_monthly_revenue');
      if (revenueError) throw new Error('Error fetching revenue:', revenueError.message);
      setMonthlyRevenue(revenueData);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Leads" value={metrics.totalLeads} />
        <MetricCard title="Total Customers" value={metrics.totalCustomers} />
        <MetricCard title="Total Jobs" value={metrics.totalJobs} />
        <MetricCard title="Total Revenue" value={`$${metrics.totalRevenue.toFixed(2)}`} />
      </div>
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

const MetricCard = ({ title, value }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export default Dashboard;
