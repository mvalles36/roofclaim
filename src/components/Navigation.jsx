import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { supabase } from '../integrations/supabase/supabase';
import { useEffect, useState } from 'react';
import { HomeIcon, UsersIcon, ClipboardIcon, FileTextIcon, MapPinIcon, CalendarIcon, BarChartIcon, LogOutIcon } from "lucide-react";

const Navigation = () => {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserRole(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
    } else if (data) {
      setUserRole(data.role);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) return null;

  return (
    <nav className="bg-gray-800 text-white w-64 h-screen p-4">
      <ul className="space-y-2">
        <li>
          <Link to="/" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <HomeIcon className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
        </li>
        {(userRole === 'admin' || userRole === 'employee') && (
          <>
            <li>
              <Link to="/inspection-scheduling" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
                <ClipboardIcon className="h-5 w-5" />
                <span>Inspections</span>
              </Link>
            </li>
            <li>
              <Link to="/claim-management" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
                <FileTextIcon className="h-5 w-5" />
                <span>Claims</span>
              </Link>
            </li>
            <li>
              <Link to="/contacts" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
                <UsersIcon className="h-5 w-5" />
                <span>Contacts</span>
              </Link>
            </li>
          </>
        )}
        <li>
          <Link to="/calendar" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <CalendarIcon className="h-5 w-5" />
            <span>Calendar</span>
          </Link>
        </li>
        {userRole === 'admin' && (
          <li>
            <Link to="/find-leads" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
              <MapPinIcon className="h-5 w-5" />
              <span>Find Leads</span>
            </Link>
          </li>
        )}
        {(userRole === 'admin' || userRole === 'employee') && (
          <li>
            <Link to="/policy-comparison" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
              <BarChartIcon className="h-5 w-5" />
              <span>Policy Comparison</span>
            </Link>
          </li>
        )}
      </ul>
      <div className="absolute bottom-4 left-4 right-4">
        <Button onClick={handleLogout} className="w-full flex items-center justify-center">
          <LogOutIcon className="h-5 w-5 mr-2" />
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;