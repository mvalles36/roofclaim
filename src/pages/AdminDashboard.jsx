import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '../integrations/supabase/supabase';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Users, FileText, Clipboard, BarChart2 } from 'lucide-react';

const AdminDashboard = () => {
  const [kpis, setKpis] = useState({
    contacts: 0,
    supplements: 0,
    inspections: 0,
    claims: 0,
    revenue: 0
  });
  const [contactTrend, setContactTrend] = useState([]);
  const [supplementDistribution, setSupplementDistribution] = useState([]);
  const [inspectionStatus, setInspectionStatus] = useState([]);
  const [claimTrend, setClaimTrend] = useState([]);

  useEffect(() => {
    fetchKPIs();
    fetchContactTrend();
    fetchSupplementDistribution();
    fetchInspectionStatus();
    fetchClaimTrend();
  }, []);

  const fetchKPIs = async () => {
    const { data, error } = await supabase.rpc('get_kpis');
    if (error) {
      console.error('Error fetching KPIs:', error);
    } else if (data) {
      setKpis(data);
    }
  };

  const fetchContactTrend = async () => {
    const { data, error } = await supabase.rpc('get_contact_trend');
    if (error) {
      console.error('Error fetching contact trend:', error);
    } else if (data) {
      setContactTrend(data);
    }
  };

  const fetchSupplementDistribution = async () => {
    const { data, error } = await supabase.rpc('get_supplement_distribution');
    if (error) {
      console.error('Error fetching supplement distribution:', error);
    } else if (data) {
      setSupplementDistribution(data);
    }
  };

  const fetchInspectionStatus = async () => {
    const { data, error } = await supabase.rpc('get_inspection_status');
    if (error) {
      console.error('Error fetching inspection status:', error);
    } else if (data) {
      setInspectionStatus(data);
    }
  };

  const fetchClaimTrend = async () => {
    const { data, error } = await supabase.rpc('get_claim_trend');
    if (error) {
      console.error('Error fetching claim trend:', error);
    } else if (data) {
      setClaimTrend(data);
    }
  };

  const kpiData = [
    { name: 'Contacts', value: kpis.contacts, icon: <Users className="h-8 w-8 text-blue-500" /> },
    { name: 'Supplements', value: kpis.supplements, icon: <FileText className="h-8 w-8 text-green-500" /> },
    { name: 'Inspections', value: kpis.inspections, icon: <Clipboard className="h-8 w-8 text-yellow-500" /> },
    { name: 'Claims', value: kpis.claims, icon: <BarChart2 className="h-8 w-8 text-purple-500" /> },
    { name: 'Revenue', value: `$${kpis.revenue.toLocaleString()}`, icon: <DollarSign className="h-8 w-8 text-red-500" /> },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={contactTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Supplement Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={supplementDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {supplementDistribution.map((entry, index) => (
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
            <CardTitle>Inspection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inspectionStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Claim Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={claimTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
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