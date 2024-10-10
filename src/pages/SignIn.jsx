import React from 'react';
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SignIn = () => {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center h-screen">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign In to RoofClaim</CardTitle>
        </CardHeader>
        <CardContent>
          <ClerkSignIn signUpUrl="/sign-up" />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;