import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Briefcase, FileText } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Navigation from '../components/Navigation';

const Dashboard = () => {
  const { user } = useUser();

  // Placeholder data - replace with actual data fetching logic
  const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 200 },
    { name: 'Apr', value: 278 },
    { name: 'May', value: 189 },
  ];

  return (
    <div className="flex">
      <Navigation />
      <div className="flex-1 p-6 space-y-6">
        <h1 className="text-3xl font-bold">Welcome, {user?.firstName || 'User'}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard title="Total Revenue" value="$50,000" icon={<DollarSign />} />
          <DashboardCard title="New Leads" value="120" icon={<Users />} />
          <DashboardCard title="Active Projects" value="25" icon={<Briefcase />} />
          <DashboardCard title="Pending Quotes" value="10" icon={<FileText />} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
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
    </div>
  );
};

const DashboardCard = ({ title, value, icon }) => (
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