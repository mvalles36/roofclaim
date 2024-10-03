import React from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { Button } from "@/components/ui/button";
import { Home, Users, FileText, Settings, Hammer, Mail, List, Robot, Search, Link, Eye, MapPin, Globe, PieChart, IdCard } from 'lucide-react';
import { navItems } from './navItems'; // Adjust the import path as necessary

const Navigation = () => {
  const { signOut } = useSupabaseAuth();

  return (
    <nav className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="text-xl font-bold mb-6">RoofClaim AI</div>
      <ul className="space-y-2">
        {navItems.map((item, index) => (
          item.label !== 'Log Out' ? (
            <li key={index}>
              <Link to={`/${item.label.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center py-2 px-4 hover:bg-gray-700 rounded transition-colors duration-200">
                {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                {item.label}
              </Link>
            </li>
          ) : (
            <li key={index}>
              <Button onClick={signOut} variant="outline" className="w-full text-white bg-[#4bd1a0] hover:bg-[#3ca880] transition-colors duration-200">
                Log Out
              </Button>
            </li>
          )
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
