import React, { createContext, useContext } from 'react';
import { useUser as useClerkUser } from '@clerk/clerk-react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user, isLoaded } = useClerkUser();

  const userWithRole = isLoaded && user ? {
    ...user,
    role: user.publicMetadata.role || 'user'
  } : null;

  return (
    <UserContext.Provider value={userWithRole}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};