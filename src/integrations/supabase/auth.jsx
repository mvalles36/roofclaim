import React from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';

export const useSupabaseAuth = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  return {
    session: user,
    userRole: user?.publicMetadata?.role || 'user',
    loading: !isLoaded,
    signUp: () => {
      console.warn('Sign up should be handled by Clerk components');
    },
    signIn: () => {
      console.warn('Sign in should be handled by Clerk components');
    },
    signOut,
    updateProfile: async (updates) => {
      console.warn('Profile updates should be handled through Clerk');
    },
  };
};

export const SupabaseAuthProvider = ({ children }) => {
  return <>{children}</>;
};

export const SupabaseAuthUI = () => {
  console.warn('SupabaseAuthUI is deprecated. Use Clerk components instead.');
  return null;
};