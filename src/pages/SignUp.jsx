import React from 'react';
import { SignUp as ClerkSignUp } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SignUp = () => {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center h-screen">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign Up for RoofClaim</CardTitle>
        </CardHeader>
        <CardContent>
          <ClerkSignUp signInUrl="/sign-in" />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;