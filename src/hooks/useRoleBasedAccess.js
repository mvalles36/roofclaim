import { useSupabaseAuth } from '../integrations/supabase/auth';

const rolePermissions = {
  admin: ['read:all', 'write:all'],
  sales: ['read:contacts', 'write:contacts', 'read:invoices', 'write:invoices', 'read:jobs', 'write:jobs', 'read:inspections', 'write:inspections'],
  sales_manager: ['read:contacts', 'write:contacts', 'read:jobs', 'write:jobs', 'read:invoices', 'write:invoices', 'read:inspections', 'write:inspections', 'read:reports'],
  project_manager: ['read:jobs', 'write:jobs', 'read:invoices', 'read:inspections', 'write:inspections'],
  customer_success: ['read:contacts', 'read:jobs', 'read:invoices', 'read:inspections'],
  contractor: ['read:jobs', 'write:jobs', 'read:inspections', 'write:inspections'],
};

export const useRoleBasedAccess = () => {
  const { userRole } = useSupabaseAuth();

  const hasPermission = (permission) => {
    if (!userRole || !rolePermissions[userRole]) return false;

    if (userRole === 'admin' && rolePermissions[userRole].includes('read:all')) {
      return true;
    }

    return rolePermissions[userRole].includes(permission);
  };

  return { hasPermission };
};
