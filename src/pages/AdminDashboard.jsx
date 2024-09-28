import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, Users, Briefcase, FileText, PieChart, BarChart2 } from 'lucide-react';
import KPICard from '../components/KPICard';
import RevenueChart from '../components/RevenueChart';
import UserManagement from '../components/UserManagement';
import SalesProcessKPIs from '../components/SalesProcessKPIs';

const AdminDashboard = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Sales Process KPIs */}
      <SalesProcessKPIs />

      {/* KPIs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-500 mr-4" />
            <span className="text-2xl font-bold">$1,234,567</span>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Total Prospects</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Users className="h-8 w-8 text-blue-500 mr-4" />
            <span className="text-2xl font-bold">1,234</span>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Total Jobs Completed</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Briefcase className="h-8 w-8 text-yellow-500 mr-4" />
            <span className="text-2xl font-bold">567</span>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Total Invoices Issued</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <FileText className="h-8 w-8 text-purple-500 mr-4" />
            <span className="text-2xl font-bold">890</span>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <PieChart className="h-48 w-48" />
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <UserManagement />

      {/* Manage Tasks Button */}
      <div className="flex space-x-4">
        <Button>Manage Tasks</Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
