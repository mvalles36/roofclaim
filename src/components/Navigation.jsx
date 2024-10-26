import React from 'react';
import { Link } from 'react-router-dom';
import { navItems } from '../nav-items';
import { useUser } from '@clerk/clerk-react';

const Navigation = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) {
    return null;
  }

  return (
    <nav className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">RoofClaim AI</h2>
      </div>
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link 
              to={`/app${item.href}`} 
              className="flex items-center p-2 hover:bg-gray-700 rounded"
            >
              {item.icon && React.createElement(item.icon, { className: "w-5 h-5 mr-3" })}
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;