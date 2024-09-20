import React from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { Button } from "@/components/ui/button";
import { Home, Users, Briefcase, FileText, Search, Inbox, CheckSquare, DollarSign, User, Settings, FileSpreadsheet, BarChart2, PieChart, Folder } from 'lucide-react';

const Navigation = () => {
  const { userRole, signOut } = useSupabaseAuth();

  const navItems = [
    { to: "/", icon: <Home className="w-4 h-4 mr-2" />, label: "Dashboard" },
    { to: "/contacts", icon: <Users className="w-4 h-4 mr-2" />, label: "Contacts" },
    { to: "/jobs", icon: <Briefcase className="w-4 h-4 mr-2" />, label: "Jobs" },
    { to: "/invoices", icon: <FileText className="w-4 h-4 mr-2" />, label: "Invoices" },
    { to: "/find-leads", icon: <Search className="w-4 h-4 mr-2" />, label: "Find Leads" },
    { to: "/supplement-tracking", icon: <Inbox className="w-4 h-4 mr-2" />, label: "Supplement Tracking" },
    { to: "/tasks", icon: <CheckSquare className="w-4 h-4 mr-2" />, label: "Tasks" },
    { to: "/insurance-mortgage-tracker", icon: <DollarSign className="w-4 h-4 mr-2" />, label: "Insurance/Mortgage Tracker" },
    { to: "/document-hub", icon: <Folder className="w-4 h-4 mr-2" />, label: "Document Hub" },
    { to: "/admin-dashboard", icon: <BarChart2 className="w-4 h-4 mr-2" />, label: "Admin Dashboard" },
    { to: "/sales-dashboard", icon: <PieChart className="w-4 h-4 mr-2" />, label: "Sales Dashboard" },
    { to: "/project-manager-dashboard", icon: <FileSpreadsheet className="w-4 h-4 mr-2" />, label: "Project Manager Dashboard" },
    { to: "/profile", icon: <User className="w-4 h-4 mr-2" />, label: "Profile" },
    { to: "/settings", icon: <Settings className="w-4 h-4 mr-2" />, label: "Settings" },
  ];

  return (
    <nav className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="text-xl font-bold mb-6">YourCompany</div>
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.to}>
            <Link to={item.to} className="flex items-center py-2 px-4 hover:bg-gray-700 rounded">
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <Button onClick={signOut} variant="outline" className="w-full text-white hover:bg-gray-700">
          Log Out
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;
