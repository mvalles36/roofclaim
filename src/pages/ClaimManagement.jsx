import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '../integrations/supabase/supabase';

const ClaimManagement = () => {
  const [claims, setClaims] = useState([]);
  const [newClaim, setNewClaim] = useState({ title: '', description: '', customer_id: '' });
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchClaims();
    fetchCustomers();
  }, []);

  const fetchClaims = async () => {
    const { data, error } = await supabase
      .from('claims')
      .select('*, customers(name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching claims:', error);
    } else {
      setClaims(data);
    }
  };

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('id, name');

    if (error) {
      console.error('Error fetching customers:', error);
    } else {
      setCustomers(data);
    }
  };

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('claims')
      .insert([{ ...newClaim, status: 'Submitted' }]);

    if (error) {
      alert('Error submitting claim: ' + error.message);
    } else {
      alert('Claim submitted successfully');
      setNewClaim({ title: '', description: '', customer_id: '' });
      fetchClaims();
    }
  };

  const handleUpdateClaimStatus = async (claimId, newStatus) => {
    const { error } = await supabase
      .from('claims')
      .update({ status: newStatus })
      .eq('id', claimId);

    if (error) {
      alert('Error updating claim status: ' + error.message);
    } else {
      fetchClaims();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Insurance Claim Management</h2>
      <Card>
        <CardHeader>
          <CardTitle>Submit New Claim</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitClaim} className="space-y-4">
            <div>
              <Label htmlFor="customer">Customer</Label>
              <Select onValueChange={(value) => setNewClaim({ ...newClaim, customer_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="title">Claim Title</Label>
              <Input
                id="title"
                value={newClaim.title}
                onChange={(e) => setNewClaim({ ...newClaim, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newClaim.description}
                onChange={(e) => setNewClaim({ ...newClaim, description: e.target.value })}
                required
              />
            </div>
            <Button type="submit">Submit Claim</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Claim Status Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          {claims.length > 0 ? (
            <ul className="space-y-4">
              {claims.map((claim) => (
                <li key={claim.id} className="border-b pb-2">
                  <h3 className="font-semibold">{claim.title}</h3>
                  <p>Customer: {claim.customers.name}</p>
                  <p>Status: {claim.status}</p>
                  <p>Submitted: {new Date(claim.created_at).toLocaleDateString()}</p>
                  <Select
                    onValueChange={(value) => handleUpdateClaimStatus(claim.id, value)}
                    defaultValue={claim.status}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Submitted">Submitted</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Denied">Denied</SelectItem>
                    </SelectContent>
                  </Select>
                </li>
              ))}
            </ul>
          ) : (
            <p>No claims submitted yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaimManagement;