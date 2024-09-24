import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '../integrations/supabase/supabase';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, Users, FileText, Clipboard } from 'lucide-react';
import { toast } from 'sonner';
import KPICard from '../components/KPICard';
import RevenueChart from '../components/RevenueChart';
import LeadChart from '../components/ProspectChart';
import UserManagement from '../components/UserManagement';

const AdminDashboard = () => {
  const [kpis, setKpis] = useState({
    totalRevenue: 0,
    totalProspects: 0,
    totalInspections: 0,
    totalSupplements: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [prospectData, setProspectData] = useState([]);

  useEffect(() => {
    fetchKPIs();
    fetchRevenueData();
    fetchProspectData();
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

  const fetchProspectData = async () => {
    const { data, error } = await supabase.rpc('get_daily_prospects');
    if (error) {
      console.error('Error fetching prospect data:', error);
    } else {
      setProspectData(data);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Revenue" value={`$${kpis.totalRevenue.toLocaleString()}`} icon={<DollarSign className="h-8 w-8 text-green-500" />} />
        <KPICard title="Total Prospects" value={kpis.totalProspects} icon={<Users className="h-8 w-8 text-blue-500" />} />
        <KPICard title="Total Inspections" value={kpis.totalInspections} icon={<Clipboard className="h-8 w-8 text-yellow-500" />} />
        <KPICard title="Total Supplements" value={kpis.totalSupplements} icon={<FileText className="h-8 w-8 text-purple-500" />} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RevenueChart data={revenueData} />
        <ProspectChart data={prospectData} />
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
