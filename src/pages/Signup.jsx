import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SignUp = () => {
  return (
    <Card className="max-w-md mx-auto mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Sign Up for RoofClaim</CardTitle>
      </CardHeader>
      <CardContent>
        <SignUp />
      </CardContent>
    </Card>
  );
};

export default SignUp;