import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../integrations/supabase/supabase';

const ProjectManagerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    onTimeCompletion: 0,
    customerSatisfaction: 0,
    averageBudgetVariance: 0,
  });
  const [resourceUtilization, setResourceUtilization] = useState([]);
  const [selectedJobStatus, setSelectedJobStatus] = useState('all'); // Placeholder for job status filter

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch jobs with optional status filter
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .order('start_date', { ascending: false })
        .limit(5);
      if (selectedJobStatus !== 'all') {
        jobsData.filter((job) => job.job_status === selectedJobStatus);
      }
      if (jobsError) throw jobsError;
      setJobs(jobsData);

      const { data: metricsData, error: metricsError } = await supabase
        .rpc('get_project_manager_metrics');

      if (metricsError) throw metricsError;
      setPerformanceMetrics(metricsData);

      const { data: utilizationData, error: utilizationError } = await supabase
        .rpc('get_resource_utilization');

      if (utilizationError) throw metricsError;
      setResourceUtilization(utilizationData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleJobStatusChange = (event) => {
    setSelectedJobStatus(event.target.value);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Project Manager Dashboard</h1>

      <div className="flex justify-between items-center mb-4">
        {/* Placeholder for job status filter */}
        <select value={selectedJobStatus} onChange={handleJobStatusChange}>
          <option value="all">All Jobs</option>
          <option value="in_progress">In Progress</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="On-Time Completion"
          value={`${performanceMetrics.onTimeCompletion}%`}
          description="Jobs completed on schedule"
        />
        <MetricCard
          title="Customer Satisfaction"
          value={`${performanceMetrics.customerSatisfaction}/5`}
          description="Average rating from customers"
        />
        <MetricCard
          title="Budget Variance"
          value={`${performanceMetrics.averageBudgetVariance}%`}
          description="Average deviation from estimated budget"
        />
      </div>
