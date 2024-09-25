import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Briefcase, FileText } from 'lucide-react';
import KPICard from '../components/KPICard';
import RevenueChart from '../components/RevenueChart';
import ProspectChart from '../components/ProspectChart';
import UserManagement from '../components/UserManagement';
import SalesProcessKPIs from '../components/SalesProcessKPIs';

const AdminDashboard = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <SalesProcessKPIs />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Revenue" value="$1,234,567" icon={<DollarSign className="h-8 w-8 text-green-500" />} />
        <KPICard title="Total Prospects" value="1,234" icon={<Users className="h-8 w-8 text-blue-500" />} />
        <KPICard title="Total Jobs" value="567" icon={<Briefcase className="h-8 w-8 text-yellow-500" />} />
        <KPICard title="Total Invoices" value="890" icon={<FileText className="h-8 w-8 text-purple-500" />} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RevenueChart />
        <ProspectChart />
      </div>
      <UserManagement />
      <div className="flex space-x-4">
        <Button asChild>
          <Link to="/find-prospects">Find Prospects</Link>
        </Button>
        <Button asChild>
          <Link to="/tasks">Manage Tasks</Link>
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
