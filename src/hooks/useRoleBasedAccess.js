import { useSupabaseAuth } from '../integrations/supabase/auth';

const rolePermissions = {
  admin: ['read:all', 'write:all'],
  sales: ['read:contacts', 'write:contacts', 'read:invoices', 'write:invoices', 'read:jobs', 'write:jobs', 'read:inspections', 'write:inspections'],
  manager: ['read:contacts', 'write:contacts', 'read:jobs', 'write:jobs', 'read:invoices', 'write:invoices', 'read:inspections', 'write:inspections'],
  supplement_specialist: ['read:invoices', 'write:invoices', 'read:contacts', 'read:inspections', 'read:jobs', 'write:jobs'],
  crew_team_leader: ['read:jobs', 'write:jobs', 'read:inspections'],
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
