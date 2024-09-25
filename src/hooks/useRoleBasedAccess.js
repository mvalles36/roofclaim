import { useSupabaseAuth } from '../integrations/supabase/auth';

const rolePermissions = {
  admin: ['read:all', 'write:all'],
  employee: ['read:contacts', 'write:contacts', 'read:invoices', 'write:invoices', 'read:jobs', 'write:jobs', 'read:inspections', 'write:inspections'],
  customer: ['read:own_profile', 'read:own_jobs', 'read:own_invoices'],
};

export const useRoleBasedAccess = () => {
  const { userRole } = useSupabaseAuth();

  const hasPermission = (permission) => {
    if (!userRole) {
      console.warn('User role not set. Defaulting to customer permissions.');
      return rolePermissions.customer.includes(permission);
    }

    if (!rolePermissions[userRole]) {
      console.error(`Invalid role: ${userRole}. Defaulting to customer permissions.`);
      return rolePermissions.customer.includes(permission);
    }

    if (userRole === 'admin' && rolePermissions[userRole].includes('read:all')) {
      return true;
    }

    return rolePermissions[userRole].includes(permission);
  };

  return { hasPermission };
};
