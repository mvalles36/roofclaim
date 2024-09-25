import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { toast } from 'sonner';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '', title: '' });
  const { session } = useSupabaseAuth();

  useEffect(() => {
    fetchUsers();
  }, [session]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: Math.random().toString(36).slice(-8), // Generate a random password
        email_confirm: true,
        user_metadata: { name: newUser.name, role: newUser.role, title: newUser.title }
      });

      if (error) throw error;

      await supabase.from('users').insert([{
        id: data.user.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        title: newUser.title // Add title field
      }]);

      fetchUsers();
      setNewUser({ name: '', email: '', role: '', title: '' });
      toast.success('User added successfully');
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
    }
  };

  const handleUpdateUserRole = async (userId, newRole, newTitle) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole, title: newTitle }) // Update role and title
        .eq('id', userId);

      if (error) throw error;
      fetchUsers();
      toast.success('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">User Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddUser} className="space-y-4">
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
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="sales_manager">Sales Manager</SelectItem>
                  <SelectItem value="project_manager">Project Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="customer_success">Customer Success</SelectItem>
                  <SelectItem value="contractor">Contractor</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newUser.title}
                onChange={(e) => setNewUser({ ...newUser, title: e.target.value })}
                required
              />
            </div>
            <Button type="submit">Add User</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.title}</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={user.role}
                      onValueChange={(value) => handleUpdateUserRole(user.id, value, user.title)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="sales_manager">Sales Manager</SelectItem>
                        <SelectItem value="project_manager">Project Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="customer_success">Customer Success</SelectItem>
                        <SelectItem value="contractor">Contractor</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
