import React from 'react';
import { Link } from 'react-router-dom';
import { navItems } from '../nav-items';
import { useUser } from '@clerk/clerk-react';

const Navigation = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (!user) {
    return null; // Don't show navigation for unauthenticated users
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex flex-wrap space-x-4">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link to={item.href} className="flex items-center hover:text-gray-300">
              <item.icon className="w-5 h-5 mr-2" />
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;