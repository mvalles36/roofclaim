import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '../integrations/supabase/supabase';
import { Link } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Users, Clock, Briefcase } from 'lucide-react';

const SalesDashboard = () => {
  const [kpis, setKpis] = useState({
    leadsConversionRate: 0,
    jobsClosed: 0,
    totalSalesRevenue: 0,
    avgTimeToClose: 0
  });
  const [leadFunnelData, setLeadFunnelData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [salesPerformance, setSalesPerformance] = useState([]);
  const [leadSourceDistribution, setLeadSourceDistribution] = useState([]);

  useEffect(() => {
    fetchSalesKPIs();
    fetchLeadFunnelData();
    fetchRecentActivities();
    fetchSalesPerformance();
    fetchLeadSourceDistribution();
  }, []);

  const fetchSalesKPIs = async () => {
    const { data, error } = await supabase.rpc('get_sales_kpis');
    if (error) {
      console.error('Error fetching Sales KPIs:', error);
    } else {
      setKpis(data);
    }
  };

  const fetchLeadFunnelData = async () => {
    const { data, error } = await supabase.rpc('get_lead_funnel_data');
    if (error) {
      console.error('Error fetching lead funnel data:', error);
    } else {
      setLeadFunnelData(data);
    }
  };

  const fetchRecentActivities = async () => {
    const { data, error } = await supabase.rpc('get_recent_sales_activities');
    if (error) {
      console.error('Error fetching recent activities:', error);
    } else {
      setRecentActivities(data);
    }
  };

  const fetchSalesPerformance = async () => {
    const { data, error } = await supabase.rpc('get_sales_performance');
    if (error) {
      console.error('Error fetching sales performance:', error);
    } else {
      setSalesPerformance(data);
    }
  };

  const fetchLeadSourceDistribution = async () => {
    const { data, error } = await supabase.rpc('get_lead_source_distribution');
    if (error) {
      console.error('Error fetching lead source distribution:', error);
    } else {
      setLeadSourceDistribution(data);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Sales Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Leads Conversion Rate" value={`${kpis.leadsConversionRate.toFixed(2)}%`} icon={<Users className="h-8 w-8 text-blue-500" />} />
        <KPICard title="Jobs Closed" value={kpis.jobsClosed} icon={<Briefcase className="h-8 w-8 text-green-500" />} />
        <KPICard title="Total Sales Revenue" value={`$${kpis.totalSalesRevenue.toLocaleString()}`} icon={<DollarSign className="h-8 w-8 text-yellow-500" />} />
        <KPICard title="Avg. Time to Close" value={`${kpis.avgTimeToClose} days`} icon={<Clock className="h-8 w-8 text-purple-500" />} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lead Funnel Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leadFunnelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                <Line type="monotone" dataKey="target" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lead Source Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leadSourceDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {leadSourceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales Activities</CardTitle>
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
      <div className="flex space-x-4">
        <Button asChild>
          <Link to="/leads">Manage Leads</Link>
        </Button>
        <Button asChild>
          <Link to="/jobs">View Jobs</Link>
        </Button>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, icon }) => (
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

export default SalesDashboard;
