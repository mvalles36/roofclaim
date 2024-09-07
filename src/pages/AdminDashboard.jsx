import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '../integrations/supabase/supabase';

const AdminDashboard = () => {
  const [inspections, setInspections] = useState([]);
  const [claims, setClaims] = useState([]);
  const [installations, setInstallations] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    // Fetch inspections
    const { data: inspectionData, error: inspectionError } = await supabase
      .from('inspections')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (inspectionError) {
      console.error('Error fetching inspections:', inspectionError);
    } else {
      setInspections(inspectionData);
    }

    // Fetch claims
    const { data: claimData, error: claimError } = await supabase
      .from('claims')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (claimError) {
      console.error('Error fetching claims:', claimError);
    } else {
      setClaims(claimData);
    }

    // Fetch installations
    const { data: installationData, error: installationError } = await supabase
      .from('installations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (installationError) {
      console.error('Error fetching installations:', installationError);
    } else {
      setInstallations(installationData);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Inspections</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {inspections.map((inspection) => (
                <li key={inspection.id}>
                  {inspection.address} - {inspection.status}
                </li>
              ))}
            </ul>
            <Button className="mt-4">Manage Inspections</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {claims.map((claim) => (
                <li key={claim.id}>
                  {claim.title} - {claim.status}
                </li>
              ))}
            </ul>
            <Button className="mt-4">Manage Claims</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Installations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {installations.map((installation) => (
                <li key={installation.id}>
                  {installation.address} - {installation.progress}% complete
                </li>
              ))}
            </ul>
            <Button className="mt-4">Manage Installations</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;