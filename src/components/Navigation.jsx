import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { Button } from '@/components/ui/button'; 
import { navItems } from '../nav-items'; 

const Navigation = () => {
  const { userRole, signOut } = useSupabaseAuth();

  return (
    <nav className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="text-xl font-bold mb-6">RoofClaim AI</div>
      <ul className="space-y-2">
        {navItems.map((item) => (
          (!item.roles || item.roles.includes(userRole)) && (
            <li key={item.label}>
              <NavLink
                to={`/${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={({ isActive }) =>
                  isActive
                    ? "bg-gray-700 flex items-center py-2 px-4 rounded"
                    : "flex items-center py-2 px-4 hover:bg-gray-700 rounded transition-colors duration-200"
                }
              >
                {item.icon && <item.icon className="w-4 h-4 mr-2" aria-hidden="true" />}
                <span>{item.label}</span>
              </NavLink>
            </li>
          )
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <Button
          onClick={signOut}
          variant="outline"
          className="w-full text-white bg-[#4bd1a0] hover:bg-[#3ca880] transition-colors duration-200"
        >
          Log Out
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;