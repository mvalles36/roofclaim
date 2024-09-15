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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .order('start_date', { ascending: false })
        .limit(5);

      if (jobsError) throw jobsError;
      setJobs(jobsData);

      const { data: metricsData, error: metricsError } = await supabase
        .rpc('get_project_manager_metrics');

      if (metricsError) throw metricsError;
      setPerformanceMetrics(metricsData);

      const { data: utilizationData, error: utilizationError } = await supabase
        .rpc('get_resource_utilization');

      if (utilizationError) throw utilizationError;
      setResourceUtilization(utilizationData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Project Manager Dashboard</h1>
      
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

      <Card>
        <CardHeader>
          <CardTitle>Active Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.map((job) => (
            <div key={job.id} className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{job.job_type}</h3>
                <span>{job.job_status}</span>
              </div>
              <Progress value={job.progress} className="mb-2" />
              <div className="text-sm text-gray-500">
                Start: {new Date(job.start_date).toLocaleDateString()} | 
                Due: {job.end_date ? new Date(job.end_date).toLocaleDateString() : 'Not set'}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resource Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={resourceUtilization}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="resource" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="utilization" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

const MetricCard = ({ title, value, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default ProjectManagerDashboard;
