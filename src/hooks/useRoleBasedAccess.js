import { useSupabaseAuth } from '../integrations/supabase/auth';

const rolePermissions = {
  admin: ['read:all', 'write:all'],
  sales: ['read:contacts', 'write:contacts', 'read:customers', 'write:customers', 'read:jobs', 'write:jobs', 'read:invoices'],
  manager: ['read:customers', 'write:customers', 'read:jobs', 'write:jobs', 'read:invoices', 'write:invoices', 'read:contacts', 'write:contacts'],
  supplement_specialist: ['read:invoices', 'write:invoices', 'read:contacts', 'read:customers', 'read:jobs', 'write:jobs' ],
};

export const useRoleBasedAccess = () => {
  const { userRole } = useSupabaseAuth();

  const hasPermission = (permission) => {
    if (!userRole || !rolePermissions[userRole]) return false;

    // Check if the user has the 'read:all' permission
    if (userRole === 'admin' && rolePermissions[userRole].includes('read:all')) {
      return true;
    }

    return rolePermissions[userRole].includes(permission);
  };

  return { hasPermission };
};
