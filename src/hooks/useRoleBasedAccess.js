// src/hooks/useRoleBasedAccess.js
import { useSupabaseAuth } from '../integrations/supabase/auth';

const rolePermissions = {
  admin: [
    'Dashboard', 
    'Inbox', 
    'Contacts', 
    'Tasks', 
    'Jobs', 
    'DocuHub', 
    'ProspectFinder', 
    'DamageDetector', 
    'Tracker', 
    'SalesGPT', 
    'Reports', 
    'WebsiteVisitors', 
    'Profile', 
    'Settings', 
    'UserManagement', 
    'AdminKnowledgeBase',
    'Logout'
  ],
  sales_manager: [
    'Dashboard', 
    'Inbox', 
    'Contacts', 
    'Tasks', 
    'Jobs', 
    'DocuHub', 
    'ProspectFinder', 
    'DamageDetector', 
    'Tracker', 
    'SalesGPT', 
    'Reports', 
    'WebsiteVisitors', 
    'Profile', 
    'Settings', 
    'Logout'
  ],
   sales: [
    'Dashboard', 
    'Inbox', 
    'Contacts', 
    'Tasks', 
    'Jobs', 
    'DocuHub', 
    'ProspectFinder', 
    'DamageDetector', 
    'Tracker', 
    'SalesGPT', 
    'Reports', 
    'WebsiteVisitors', 
    'Profile', 
    'Settings', 
    'Logout'
  ],
  project_manager: [
    'Dashboard', 
    'Inbox', 
    'Contacts', 
    'Tasks', 
    'Jobs', 
    'DocuHub', 
    'DamageDetector', 
    'Tracker', 
    'SalesGPT', 
    'Reports', 
    'WebsiteVisitors', 
    'Profile', 
    'Settings', 
    'Logout'
  ],
  customer_success: [
    'Dashboard', 
    'Inbox', 
    'Contacts', 
    'Tasks', 
    'Jobs', 
    'DocuHub',
    'DamageDetector',
    'Tracker',
    'Reports',
    'WebsiteVisitors', 
    'Profile', 
    'Settings', 
    'Logout'
  ],
  contractor: [
    'ContractorPortal',
    'Profile', 
    'Logout'
  ],
  customer: [
    'ClientPortal', 
    'Profile', 
    'Logout'
  ],
};

export const useRoleBasedAccess = () => {
  const { userRole } = useSupabaseAuth();

  const hasAccess = (page) => {
    const role = userRole || 'sales'; // Default to 'customer'
    return rolePermissions[role].includes(page);
  };

  return { hasAccess };
};
