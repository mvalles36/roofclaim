import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to RoofClaim AI, {user?.firstName || 'User'}!</h1>
      <Card>
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Welcome to your insurance restoration roofing platform. Choose an option to get started:</p>
          <div className="space-y-2">
            <Button onClick={() => navigate('/dashboard')} className="w-full">Go to Dashboard</Button>
            <Button onClick={() => navigate('/find-prospects')} className="w-full">Find Prospects</Button>
            <Button onClick={() => navigate('/damage-detection')} className="w-full">Damage Detection</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;