import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { supabase } from '../integrations/supabase/supabase';
import { useEffect, useState } from 'react';

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

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold text-gray-800">RoofClaim CRM</Link>
          <div className="space-x-4">
            {session ? (
              <>
                <Link to="/" className="text-gray-600 hover:text-gray-800">Dashboard</Link>
                <Link to="/calendar" className="text-gray-600 hover:text-gray-800">Calendar</Link>
                {(userRole === 'customer' || userRole === 'admin') && (
                  <>
                    <Link to="/inspection-scheduling" className="text-gray-600 hover:text-gray-800">Schedule Inspection</Link>
                    <Link to="/installation-tracking" className="text-gray-600 hover:text-gray-800">Installation Progress</Link>
                  </>
                )}
                {(userRole === 'employee' || userRole === 'admin') && (
                  <Link to="/inspection-report" className="text-gray-600 hover:text-gray-800">Inspection Reports</Link>
                )}
                {(userRole === 'admin' || userRole === 'admin') && (
                  <>
                    <Link to="/claim-management" className="text-gray-600 hover:text-gray-800">Claims</Link>
                    <Link to="/policy-comparison" className="text-gray-600 hover:text-gray-800">Policy Comparison</Link>
                  </>
                )}
                {userRole === 'admin' && (
                  <>
                    <Link to="/AdminDashboard" className="text-gray-600 hover:text-gray-800">Admin</Link>
                    <Link to="/find-leads" className="text-gray-600 hover:text-gray-800">Find Leads</Link>
                  </>
                )}
                <Button onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-800">Login</Link>
                <Link to="/signup" className="text-gray-600 hover:text-gray-800">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
