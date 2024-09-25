import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '../integrations/supabase/supabase';
import { toast } from 'sonner';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', role: '', name: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleInviteUser = async (e) => {
    e.preventDefault();
    try {
      const inviteToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const { data, error } = await supabase
        .from('users')
        .insert([{
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          status: 'pending',
          invite_token: inviteToken
        }]);

      if (error) throw error;

      await sendInvitationEmail(newUser.email, inviteToken);

      fetchUsers();
      setNewUser({ email: '', role: '', name: '' });
      toast.success('Invitation sent successfully');
    } catch (error) {
      console.error('Error inviting user:', error);
      toast.error('Failed to send invitation');
    }
  };

  const sendInvitationEmail = async (email, token) => {
    // Implement email sending logic here
    console.log(`Sending invitation to ${email} with token ${token}`);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleInviteUser} className="space-y-4 mb-6">
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
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Invite User</Button>
        </form>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Name</th>
                <th className="text-left">Email</th>
                <th className="text-left">Role</th>
                <th className="text-left">Status</th>
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
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="sales_manager">Sales Manager</SelectItem>
                        <SelectItem value="project_manager">Project Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="customer_success">Customer Success</SelectItem>
                        <SelectItem value="contractor">Contractor</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td>{user.status}</td>
                  <td>
                    {user.status === 'pending' && (
                      <Button onClick={() => sendInvitationEmail(user.email, user.invite_token)}>
                        Resend Invite
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
