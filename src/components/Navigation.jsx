import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const Navigation = ({ session }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold text-gray-800">Roofing Co.</Link>
          <div className="space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-800">Home</Link>
            {session ? (
              <>
                <Link to="/inspections" className="text-gray-600 hover:text-gray-800">Inspections</Link>
                <Link to="/claims" className="text-gray-600 hover:text-gray-800">Claims</Link>
                <Link to="/installation-progress" className="text-gray-600 hover:text-gray-800">Installation Progress</Link>
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