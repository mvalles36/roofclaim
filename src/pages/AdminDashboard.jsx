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

const AdminDashboard = () => {
  const [kpis, setKpis] = useState({
    totalRevenue: 0,
    totalLeads: 0,
    totalInspections: 0,
    totalSupplements: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [leadData, setLeadData] = useState([]);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', role: '', name: '' });

  useEffect(() => {
    fetchKPIs();
    fetchRevenueData();
    fetchLeadData();
    fetchUsers();
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

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: Math.random().toString(36).slice(-8), // Generate a random password
        email_confirm: true,
        user_metadata: { name: newUser.name, role: newUser.role }
      });

      if (error) throw error;

      await supabase.from('users').insert([{
        id: data.user.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }]);

      fetchUsers();
      setNewUser({ email: '', role: '', name: '' });
      toast.success('User added successfully');
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      fetchUsers();
      toast.success('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleToggleUserStatus = async (userId, isDisabled) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_disabled: !isDisabled })
        .eq('id', userId);

      if (error) throw error;
      fetchUsers();
      toast.success(`User ${isDisabled ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Failed to update user status');
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
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddUser} className="space-y-4 mb-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={(value) => setNewUser({ ...newUser, role: value })} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="supplement_specialist">Supplement Specialist</SelectItem>
                  <SelectItem value="crew_team_leader">Crew Team Leader</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Add User</Button>
          </form>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Name</th>
                  <th className="text-left">Email</th>
                  <th className="text-left">Role</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <Select
                        defaultValue={user.role}
                        onValueChange={(value) => handleUpdateUserRole(user.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="supplement_specialist">Supplement Specialist</SelectItem>
                          <SelectItem value="crew_team_leader">Crew Team Leader</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td>
                      <Button
                        onClick={() => handleToggleUserStatus(user.id, user.is_disabled)}
                        variant={user.is_disabled ? "default" : "destructive"}
                      >
                        {user.is_disabled ? "Enable" : "Disable"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
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
