import React from 'react';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, useNavigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { CLERK_PUBLISHABLE_KEY } from './config/env';

const queryClient = new QueryClient();

const App = () => {
  const navigate = useNavigate();

  if (!CLERK_PUBLISHABLE_KEY) {
    console.error("Clerk Publishable Key is missing");
    return <div>Error: Clerk Publishable Key is missing. Please check your environment variables.</div>;
  }

  return (
    <ClerkProvider 
      publishableKey={CLERK_PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
    >
      <QueryClientProvider client={queryClient}>
        <SignedIn>
          <Outlet />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
        <Toaster />
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default App;