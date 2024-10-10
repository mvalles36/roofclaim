import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser, SignOutButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const { user } = useUser();

  return (
    <nav className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="text-xl font-bold mb-6">RoofClaim AI</div>
      <ul className="space-y-2">
        <li><NavLink to="/dashboard" className="block py-2 px-4 hover:bg-gray-700">Dashboard</NavLink></li>
        <li><NavLink to="/contacts" className="block py-2 px-4 hover:bg-gray-700">Contacts</NavLink></li>
        <li><NavLink to="/tasks" className="block py-2 px-4 hover:bg-gray-700">Tasks</NavLink></li>
        {user?.publicMetadata?.role === 'admin' && (
          <li><NavLink to="/user-management" className="block py-2 px-4 hover:bg-gray-700">User Management</NavLink></li>
        )}
        <li><NavLink to="/settings" className="block py-2 px-4 hover:bg-gray-700">Settings</NavLink></li>
      </ul>
      <div className="mt-auto pt-6">
        <SignOutButton>
          <Button variant="outline" className="w-full">
            Log Out
          </Button>
        </SignOutButton>
      </div>
    </nav>
  );
};

export default Navigation;