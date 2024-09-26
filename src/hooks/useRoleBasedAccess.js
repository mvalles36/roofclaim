import { useSupabaseAuth } from '../integrations/supabase/auth';

const rolePermissions = {
  admin: ['read:all', 'write:all'],
  employee: ['read:contacts', 'write:contacts', 'read:invoices', 'write:invoices', 'read:jobs', 'write:jobs', 'read:inspections', 'write:inspections'],
  customer: ['read:own_profile', 'read:own_jobs', 'read:own_invoices'],
};

export const useRoleBasedAccess = () => {
  const { userRole } = useSupabaseAuth();

  const hasPermission = (permission) => {
    const role = userRole || 'customer'; // Default to 'customer' if no role is set

    if (!rolePermissions[role]) {
      console.error(`Invalid role: ${role}. Defaulting to customer permissions.`);
      return rolePermissions.customer.includes(permission);
    }

    if (role === 'admin' && rolePermissions[role].includes('read:all')) {
      return true;
    }

    return rolePermissions[role].includes(permission);
  };

  return { hasPermission };
};
