import React from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const { userRole } = useSupabaseAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/" className="text-white hover:text-gray-300">YourCompany</Link>
        </div>
        <div className="space-x-4">
          <Link to="/dashboard">
            <Button variant="outline" className="text-white hover:bg-gray-700">Dashboard</Button>
          </Link>
          <Link to="/tasks">
            <Button variant="outline" className="text-white hover:bg-gray-700">Tasks</Button>
          </Link>
          <Link to="/insurance-mortgage-tracker">
            <Button variant="outline" className="text-white hover:bg-gray-700">Mortgage Check Tracker</Button>
          </Link>
          <Link to="/document-hub">
            <Button variant="outline" className="text-white hover:bg-gray-700">Document Hub</Button>
          </Link>
          <Link to="/damage-detection">
            <Button variant="outline" className="text-white hover:bg-gray-700">Damage Detection</Button>
          </Link>
          <Link to="/supplement-tracker">
            <Button variant="outline" className="text-white hover:bg-gray-700">Supplement Tracker</Button>
          </Link>
        </div>
        <div>
          {/* Add user-related options if needed */}
          {userRole && (
            <div className="flex items-center">
              <span className="mr-4">{userRole}</span>
              <Button variant="outline" className="text-white hover:bg-gray-700">
                Log Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
