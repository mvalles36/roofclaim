import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/clerk-react";

const Header = () => {
  const navigate = useNavigate();
  
  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          Pipeline AI
        </h1>
        <div className="space-x-4">
          <Button variant="ghost" onClick={() => navigate('/app')}>Dashboard</Button>
          <Button variant="ghost" onClick={() => navigate('/sign-up')}>Get Started</Button>
          <SignInButton mode="modal">
            <Button variant="outline">Sign In</Button>
          </SignInButton>
        </div>
      </nav>
    </header>
  );
};

export default Header;