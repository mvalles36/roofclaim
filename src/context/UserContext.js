import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../integrations/supabase/supabase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // State to hold user and role data

  useEffect(() => {
    const fetchUser = async () => {
      const session = supabase.auth.session(); // Fetch session data
      if (session) {
        const { data: userRole, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          console.error('Error fetching user role:', error);
          return;
        }

        setUser({ ...session.user, role: userRole.role });  // Set user with role
      }
    };

    fetchUser();
  }, []);  // Run only once when the component mounts

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
