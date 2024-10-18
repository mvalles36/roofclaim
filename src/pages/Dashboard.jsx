import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from '@clerk/clerk-react';
import { DollarSign, Users, Briefcase, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import KPICard from '../components/KPICard';
import LeadChart from '../components/LeadChart';
import ProspectChart from '../components/ProspectChart';
import RevenueChart from '../components/RevenueChart';
import SalesProcessKPIs from '../components/SalesProcessKPIs';
import SalesProcessVisualization from '../components/SalesProcessVisualization';
import WebsiteVisitors from '../components/WebsiteVisitors';

const Dashboard = () => {
  const { user } = useUser();

  const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 200 },
    { name: 'Apr', value: 278 },
    { name: 'May', value: 189 },
  ];

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.firstName || 'User'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard title="Total Revenue" value="$50,000" icon={<DollarSign />} />
        <KPICard title="New Leads" value="120" icon={<Users />} />
        <KPICard title="Active Projects" value="25" icon={<Briefcase />} />
        <KPICard title="Pending Quotes" value="10" icon={<FileText />} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Lead Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Prospect Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <ProspectChart />
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales Process KPIs</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesProcessKPIs />
          </CardContent>
        </Card>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sales Process Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesProcessVisualization />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Website Visitors</CardTitle>
        </CardHeader>
        <CardContent>
          <WebsiteVisitors />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;