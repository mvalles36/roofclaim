import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../integrations/supabase/supabase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const session = supabase.auth.session();
      if (session) {
        const { data: userRole } = await supabase.from('users').select('role').eq('id', session.user.id).single();
        setUser({ ...session.user, role: userRole.role });
      }
    };
    fetchUser();
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
