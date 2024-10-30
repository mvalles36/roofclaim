import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, useAuth } from "@clerk/clerk-react";

const Header = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  
  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          Pipeline AI
        </h1>
        <div className="space-x-4">
          {isSignedIn ? (
            <Button variant="default" onClick={() => navigate('/app')}>
              Go to Dashboard
            </Button>
          ) : (
            <>
              <SignUpButton mode="modal">
                <Button variant="default">
                  Start Free Trial
                </Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button variant="outline">
                  Sign In
                </Button>
              </SignInButton>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;