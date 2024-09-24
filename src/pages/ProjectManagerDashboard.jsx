import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '../integrations/supabase/supabase';

const ProjectManagerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    onTimeCompletion: 0,
    contactSatisfaction: 0,
    averageBudgetVariance: 0,
  });
  const [resourceUtilization, setResourceUtilization] = useState([]);
  const [projectTimeline, setProjectTimeline] = useState([]);
  const [budgetOverview, setBudgetOverview] = useState([]);
  const [selectedJobStatus, setSelectedJobStatus] = useState('all');

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
      if (utilizationError) throw utilizationError;
      setResourceUtilization(utilizationData);

      const { data: timelineData, error: timelineError } = await supabase
        .rpc('get_project_timeline');
      if (timelineError) throw timelineError;
      setProjectTimeline(timelineData);

      const { data: budgetData, error: budgetError } = await supabase
        .rpc('get_budget_overview');
      if (budgetError) throw budgetError;
      setBudgetOverview(budgetData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleJobStatusChange = (event) => {
    setSelectedJobStatus(event.target.value);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Project Manager Dashboard</h1>

      <div className="flex justify-between items-center mb-4">
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
          title="Satisfaction"
          value={`${performanceMetrics.contactSatisfaction}/5`}
          description="Average rating from customers"
        />
        <MetricCard
          title="Budget Variance"
          value={`${performanceMetrics.averageBudgetVariance}%`}
          description="Average deviation from estimated budget"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <Card>
          <CardHeader>
            <CardTitle>Project Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={projectTimeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="plannedProgress" stroke="#8884d8" />
                <Line type="monotone" dataKey="actualProgress" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={budgetOverview}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {budgetOverview.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

const MetricCard = ({ title, value, description }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-gray-500">{description}</p>
    </CardContent>
  </Card>
);

export default ProjectManagerDashboard;
