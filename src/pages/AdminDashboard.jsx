import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '../integrations/supabase/supabase';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
    { name: 'Turnaround Time', value: kpis.turnaroundTime },
    { name: 'Approval Rate', value: kpis.approvalRate },
    { name: 'Revenue Impact', value: kpis.revenueImpact },
    { name: 'Error Rate', value: kpis.errorRate },
    { name: 'Client Satisfaction', value: kpis.clientSatisfaction },
    { name: 'Document Handling Time', value: kpis.documentHandlingTime },
    { name: 'Compliance Rate', value: kpis.complianceRate },
    { name: 'Supplement Volume', value: kpis.supplementVolume },
    { name: 'Cost of Processing', value: kpis.costOfProcessing }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.name}>
            <CardHeader>
              <CardTitle>{kpi.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>KPI Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
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
      </div>
    </div>
  );
};

export default AdminDashboard;