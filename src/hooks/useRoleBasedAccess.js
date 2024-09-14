import { useSupabaseAuth } from '../integrations/supabase/auth';

const rolePermissions = {
  admin: ['read:all', 'write:all'],
  sales: ['read:contacts', 'write:contacts', 'read:customers', 'write:customers', 'read:jobs', 'write:jobs', 'read:invoices'],
  support: ['read:customers', 'read:jobs', 'read:invoices'],
  accountant: ['read:invoices', 'write:invoices'],
};

export const useRoleBasedAccess = () => {
  const { userRole } = useSupabaseAuth();

  const hasPermission = (permission) => {
    if (!userRole || !rolePermissions[userRole]) return false;
    return rolePermissions[userRole].includes(permission);
  };

  return { hasPermission };
};