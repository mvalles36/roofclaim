import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '../integrations/supabase/supabase';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Clock, CheckCircle, AlertTriangle, Users, FileText, Shield, BarChart2, CreditCard } from 'lucide-react';

const AdminDashboard = () => {
  const [kpis, setKpis] = useState({
    turnaroundTime: 0,
    approvalRate: 0,
    revenueImpact: 0,
    errorRate: 0,
    clientSatisfaction: 0,
    documentHandlingTime: 0,
    complianceRate: 0,
    supplementVolume: 0,
    costOfProcessing: 0
  });

  useEffect(() => {
    fetchKPIs();
  }, []);

  const fetchKPIs = async () => {
    // This is a placeholder. In a real application, you would fetch this data from your backend.
    const { data, error } = await supabase
      .from('kpis')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching KPIs:', error);
    } else if (data) {
      setKpis(data);
    }
  };

  const kpiData = [
    { name: 'Turnaround Time', value: kpis.turnaroundTime, icon: <Clock className="h-8 w-8 text-blue-500" /> },
    { name: 'Approval Rate', value: kpis.approvalRate, icon: <CheckCircle className="h-8 w-8 text-green-500" /> },
    { name: 'Revenue Impact', value: kpis.revenueImpact, icon: <DollarSign className="h-8 w-8 text-yellow-500" /> },
    { name: 'Error Rate', value: kpis.errorRate, icon: <AlertTriangle className="h-8 w-8 text-red-500" /> },
    { name: 'Client Satisfaction', value: kpis.clientSatisfaction, icon: <Users className="h-8 w-8 text-purple-500" /> },
    { name: 'Document Handling Time', value: kpis.documentHandlingTime, icon: <FileText className="h-8 w-8 text-indigo-500" /> },
    { name: 'Compliance Rate', value: kpis.complianceRate, icon: <Shield className="h-8 w-8 text-teal-500" /> },
    { name: 'Supplement Volume', value: kpis.supplementVolume, icon: <BarChart2 className="h-8 w-8 text-pink-500" /> },
    { name: 'Cost of Processing', value: kpis.costOfProcessing, icon: <CreditCard className="h-8 w-8 text-orange-500" /> }
  ];

  return (
    <div className="space-y-6 p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiData.map((kpi) => (
          <Card key={kpi.name} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
              {kpi.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>KPI Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={kpiData}>
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
      <div className="flex space-x-4">
        <Button asChild>
          <Link to="/claim-management">Manage Claims</Link>
        </Button>
        <Button asChild>
          <Link to="/inspection-scheduling">Schedule Inspections</Link>
        </Button>
        <Button asChild>
          <Link to="/find-leads">Find Leads</Link>
        </Button>
        <Button asChild>
          <Link to="/supplement-tracking">Supplement Tracking</Link>
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;