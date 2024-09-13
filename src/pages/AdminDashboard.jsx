import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '../integrations/supabase/supabase';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, Users, FileText, Clipboard } from 'lucide-react';

const AdminDashboard = () => {
  const [kpis, setKpis] = useState({
    totalRevenue: 0,
    totalLeads: 0,
    totalInspections: 0,
    totalSupplements: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [leadData, setLeadData] = useState([]);

  useEffect(() => {
    fetchKPIs();
    fetchRevenueData();
    fetchLeadData();
  }, []);

  const fetchKPIs = async () => {
    const { data, error } = await supabase.rpc('get_admin_kpis');
    if (error) {
      console.error('Error fetching KPIs:', error);
    } else {
      setKpis(data);
    }
  };

  const fetchRevenueData = async () => {
    const { data, error } = await supabase.rpc('get_monthly_revenue');
    if (error) {
      console.error('Error fetching revenue data:', error);
    } else {
      setRevenueData(data);
    }
  };

  const fetchLeadData = async () => {
    const { data, error } = await supabase.rpc('get_daily_leads');
    if (error) {
      console.error('Error fetching lead data:', error);
    } else {
      setLeadData(data);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Revenue" value={`$${kpis.totalRevenue.toLocaleString()}`} icon={<DollarSign className="h-8 w-8 text-green-500" />} />
        <KPICard title="Total Leads" value={kpis.totalLeads} icon={<Users className="h-8 w-8 text-blue-500" />} />
        <KPICard title="Total Inspections" value={kpis.totalInspections} icon={<Clipboard className="h-8 w-8 text-yellow-500" />} />
        <KPICard title="Total Supplements" value={kpis.totalSupplements} icon={<FileText className="h-8 w-8 text-purple-500" />} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
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
            <CardTitle>Daily Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={leadData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="leads" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="flex space-x-4">
        <Button asChild>
          <Link to="/find-leads">Find Leads</Link>
        </Button>
        <Button asChild>
          <Link to="/tasks">Manage Tasks</Link>
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

export default AdminDashboard;