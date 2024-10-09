import React, { createContext, useContext } from 'react';
import { useUser } from '@clerk/clerk-react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user, isLoaded } = useUser();

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

export const useUserContext = () => useContext(UserContext);