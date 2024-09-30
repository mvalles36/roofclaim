// src/components/SalesManagerDashboard.js

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from 'lucide-react';
import { getTotalCompletedTasksByRole, getDeletedTasksCount } from '../services/TaskApi';
import { salesGPTService } from '../services/SalesGPTService';

const SalesManagerDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalJobs: 0,
    totalInvoices: 0,
    totalCompletedTasks: 0,
    totalDeletedTasks: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchSalesManagerDashboardData();
  }, []);

  const fetchSalesManagerDashboardData = async () => {
    try {
      // Fetch metrics from the SalesGPT service
      const salesMetrics = await salesGPTService.getMetrics();
      setMetrics((prevMetrics) => ({
        ...prevMetrics,
        totalRevenue: salesMetrics.totalRevenue,
        totalJobs: salesMetrics.totalJobs,
        totalInvoices: salesMetrics.totalInvoices,
      }));

      // Fetch completed and deleted tasks
      const completedTasks = await getTotalCompletedTasksByRole();
      const deletedTasks = await getDeletedTasksCount();
      setMetrics((prevMetrics) => ({
        ...prevMetrics,
        totalCompletedTasks: completedTasks,
        totalDeletedTasks: deletedTasks,
      }));

      // Fetch recent activities
      const { data: activitiesData, error } = await supabase.rpc('get_recent_activities');
      if (error) throw error;
      setRecentActivities(activitiesData);
    } catch (error) {
      console.error('Error fetching sales manager dashboard data:', error);
    }
  };

  const handlePraise = () => {
    alert("Team praised! 🎉");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Sales Manager Dashboard</h1>
      <button onClick={handlePraise} className="bg-[#4bd1a0] text-white rounded-lg px-4 py-2 shadow hover:bg-opacity-90">
        <Bell className="inline h-5 w-5 mr-1" />
        Praise Team
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Revenue" value={`$${metrics.totalRevenue.toFixed(2)}`} />
        <MetricCard title="Total Jobs" value={metrics.totalJobs} />
        <MetricCard title="Total Invoices" value={metrics.totalInvoices} />
        <MetricCard title="Completed Tasks" value={metrics.totalCompletedTasks} />
        <MetricCard title="Deleted Tasks" value={metrics.totalDeletedTasks} />
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

const MetricCard = ({ title, value }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
); 

export default SalesManagerDashboard;
