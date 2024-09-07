import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '../integrations/supabase/supabase';
import { Link } from 'react-router-dom';

const InspectorDashboard = () => {
  const [inspections, setInspections] = useState([]);

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    const { data, error } = await supabase
      .from('inspections')
      .select('*, customers(name)')
      .order('scheduled_date', { ascending: true })
      .limit(5);

    if (error) {
      console.error('Error fetching inspections:', error);
    } else {
      setInspections(data);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Inspector Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Inspections</CardTitle>
        </CardHeader>
        <CardContent>
          {inspections.length > 0 ? (
            <ul className="space-y-4">
              {inspections.map((inspection) => (
                <li key={inspection.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{inspection.customers.name}</p>
                    <p>{inspection.address}</p>
                    <p>{new Date(inspection.scheduled_date).toLocaleString()}</p>
                  </div>
                  <Button asChild>
                    <Link to={`/inspection-report/${inspection.id}`}>View Report</Link>
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming inspections.</p>
          )}
        </CardContent>
      </Card>
      <Button asChild>
        <Link to="/inspection-report">Create New Report</Link>
      </Button>
    </div>
  );
};

export default InspectorDashboard;