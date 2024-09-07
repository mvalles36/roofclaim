import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Inspections = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleScheduleInspection = () => {
    // Here you would typically make an API call to schedule the inspection
    alert(`Inspection scheduled for ${selectedDate.toDateString()}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Schedule Drone Roof Inspection</h2>
      <Card>
        <CardHeader>
          <CardTitle>Select a Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
          <Button 
            onClick={handleScheduleInspection} 
            disabled={!selectedDate}
            className="mt-4"
          >
            Schedule Inspection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inspections;