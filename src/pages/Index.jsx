import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Welcome to RoofClaim AI</h1>
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Please sign in to access the platform.</p>
            <Button onClick={() => navigate('/sign-in')} className="w-full">Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to RoofClaim AI, {user.firstName || 'User'}!</h1>
      <Card>
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Welcome to your insurance restoration roofing platform. Choose an option to get started:</p>
          <div className="space-y-2">
            <Button onClick={() => navigate('/dashboard')} className="w-full">Go to Dashboard</Button>
            <Button onClick={() => navigate('/contacts')} className="w-full">Manage Contacts</Button>
            <Button onClick={() => navigate('/tasks')} className="w-full">View Tasks</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;