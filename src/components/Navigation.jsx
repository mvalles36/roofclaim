import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { supabase } from '../integrations/supabase/supabase';

const Navigation = ({ session, userRole }) => {
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
                {(userRole === 'homeowner' || userRole === 'admin') && (
                  <>
                    <Link to="/inspection-scheduling" className="text-gray-600 hover:text-gray-800">Schedule Inspection</Link>
                    <Link to="/installation-tracking" className="text-gray-600 hover:text-gray-800">Installation Progress</Link>
                  </>
                )}
                {(userRole === 'inspector' || userRole === 'admin') && (
                  <Link to="/inspection-report" className="text-gray-600 hover:text-gray-800">Inspection Reports</Link>
                )}
                {(userRole === 'claims_adjuster' || userRole === 'admin') && (
                  <>
                    <Link to="/claim-management" className="text-gray-600 hover:text-gray-800">Claims</Link>
                    <Link to="/policy-comparison" className="text-gray-600 hover:text-gray-800">Policy Comparison</Link>
                  </>
                )}
                {userRole === 'admin' && (
                  <Link to="/admin" className="text-gray-600 hover:text-gray-800">Admin</Link>
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