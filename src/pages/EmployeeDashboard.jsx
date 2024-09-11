import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '../integrations/supabase/supabase';
import { Link } from 'react-router-dom';

const EmployeeDashboard = () => {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    const { data, error } = await supabase
      .from('claims')
      .select('*, customers(name)')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching claims:', error);
    } else {
      setClaims(data);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Employee Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Claims</CardTitle>
        </CardHeader>
        <CardContent>
          {claims.length > 0 ? (
            <ul className="space-y-4">
              {claims.map((claim) => (
                <li key={claim.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{claim.customers.name}</p>
                    <p>{claim.title}</p>
                    <p>Status: {claim.status}</p>
                  </div>
                  <Button asChild>
                    <Link to={`/claim-management/${claim.id}`}>View Claim</Link>
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent claims.</p>
          )}
        </CardContent>
      </Card>
      <div className="flex space-x-4">
        <Button asChild>
          <Link to="/claim-management">Manage Claims</Link>
        </Button>
        <Button asChild>
          <Link to="/policy-comparison">Policy Comparison</Link>
        </Button>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
