import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ClientPortal = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Client Portal</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to the Client Portal</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a placeholder for the Client Portal. Implementation coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientPortal;