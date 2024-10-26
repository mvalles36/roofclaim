import React from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { Outlet } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import Navigation from './components/Navigation';

const App = () => {
  return (
    <>
      <SignedIn>
        <div className="flex h-screen">
          <Navigation />
          <main className="flex-1 overflow-auto bg-gray-50">
            <Outlet />
          </main>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <Toaster />
    </>
  );
};

export default App;