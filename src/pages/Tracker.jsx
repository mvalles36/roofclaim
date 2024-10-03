import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Tracker = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tracker</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tracker will track insurance and supplement payments</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Implementation coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tracker;
