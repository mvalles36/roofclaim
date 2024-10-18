import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Calendar = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          {/* TODO: Implement calendar functionality */}
          <p>Calendar functionality coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;