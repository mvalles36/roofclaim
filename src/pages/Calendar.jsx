import { useState, useEffect } from 'react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '../integrations/supabase/supabase';

const Calendar = () => {
  const [inspections, setInspections] = useState([]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    fetchUserRole();
    fetchInspections();
  }, []);

  const fetchUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
      } else if (data) {
        setUserRole(data.role);
      }
    }
  };

  const fetchInspections = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      let query = supabase.from('inspections').select('*');
      
      if (userRole === 'homeowner') {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching inspections:', error);
      } else {
        setInspections(data);
      }
    }
  };

  const inspectionDates = inspections.map(inspection => new Date(inspection.scheduled_date));

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Inspection Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <CalendarComponent
          mode="multiple"
          selected={inspectionDates}
          className="rounded-md border"
        />
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Upcoming Inspections:</h3>
          <ul>
            {inspections.map((inspection, index) => (
              <li key={index}>
                {new Date(inspection.scheduled_date).toLocaleDateString()} - {inspection.status}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default Calendar;