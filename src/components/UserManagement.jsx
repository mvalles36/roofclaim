import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from '../integrations/supabase/supabase';
import { toast } from 'sonner';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', role: '', first_name: '', last_name });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setUsers(data); // Ensure data is assigned correctly
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    try {
      const inviteToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const { error } = await supabase
        .from('users')
        .insert([{
          email: newUser.email,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          role: newUser.role,
          status: 'pending',
          invite_token: inviteToken
        }]);

      if (error) throw error;

      await sendInvitationEmail(newUser.email, inviteToken);

      fetchUsers();
      setNewUser({ email: '', role: '', first_name: '', last_name });
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
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              value={newUser.first_name}
              onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
              required
            />
          </div>
           <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              value={newUser.last_name}
              onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
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
                <SelectItem value="sales_manager">Sales Manager</SelectItem>
                <SelectItem value="project_manager">Project Manager</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="customer_success">Customer Success</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="contractor">Contractor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Invite User</Button>
        </form>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={user.role}
                    onValueChange={(value) => handleUpdateUserRole(user.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="sales_manager">Sales Manager</SelectItem>
                <SelectItem value="project_manager">Project Manager</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="customer_success">Customer Success</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="contractor">Contractor</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  {user.status === 'pending' && (
                    <Button onClick={() => sendInvitationEmail(user.email, user.invite_token)}>
                      Resend Invite
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
