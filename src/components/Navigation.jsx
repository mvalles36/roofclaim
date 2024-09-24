import React from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { Button } from "@/components/ui/button";
import { Home, Users, Briefcase, FileText, Search, Inbox, CheckSquare, DollarSign, User, Settings, FileSpreadsheet, BarChart2, PieChart, Folder, Phone, Bot, Shield, Mail, UserCog, FileCheck } from 'lucide-react';

const Navigation = () => {
  const { userRole, signOut } = useSupabaseAuth();

  const navItems = [
    { to: "/", icon: <Home className="w-4 h-4 mr-2" />, label: "Dashboard" },
    { to: "/contacts", icon: <Users className="w-4 h-4 mr-2" />, label: "Contacts" },
    { to: "/jobs", icon: <Briefcase className="w-4 h-4 mr-2" />, label: "Jobs" },
    { to: "/invoices", icon: <FileText className="w-4 h-4 mr-2" />, label: "Invoices" },
    { to: "/find-prospects", icon: <Search className="w-4 h-4 mr-2" />, label: "Find Prospects" },
    { to: "/supplement-tracking", icon: <Inbox className="w-4 h-4 mr-2" />, label: "Supplement Tracking" },
    { to: "/tasks", icon: <CheckSquare className="w-4 h-4 mr-2" />, label: "Tasks" },
    { to: "/insurance-mortgage-tracker", icon: <DollarSign className="w-4 h-4 mr-2" />, label: "Insurance/Mortgage Tracker" },
    { to: "/document-hub", icon: <Folder className="w-4 h-4 mr-2" />, label: "Document Hub" },
    { to: "/admin-dashboard", icon: <Shield className="w-4 h-4 mr-2" />, label: "Admin Dashboard", roles: ['admin'] },
    { to: "/sales-dashboard", icon: <BarChart2 className="w-4 h-4 mr-2" />, label: "Sales Dashboard", roles:['sales'] },
    { to: "/sales-manager-dashboard", icon: <FileSpreadsheet className="w-4 h-4 mr-2" />, label: "Sales Manager Dashboard", roles: ['sales_manager'] },
    { to: "/project-manager-dashboard", icon: <FileSpreadsheet className="w-4 h-4 mr-2" />, label: "Project Manager Dashboard", roles: ['project_manager'] },
    { to: "/customer-success-dashboard", icon: <FileSpreadsheet className="w-4 h-4 mr-2" />, label: "Customer Success Dashboard", roles: ['customer_success'] },
    { to: "/damage-detection", icon: <PieChart className="w-4 h-4 mr-2" />, label: "Damage Detection" },
    { to: "/sales-gpt", icon: <Bot className="w-4 h-4 mr-2" />, label: "SalesGPT" },
    { to: "/inbox", icon: <Mail className="w-4 h-4 mr-2" />, label: "Inbox" },
    { to: "/client-portal", icon: <User className="w-4 h-4 mr-2" />, label: "Client Portal" },
    { to: "/smart-supplement", icon: <FileCheck className="w-4 h-4 mr-2" />, label: "Smart Supplement" },
    { to: "/user-management", icon: <UserCog className="w-4 h-4 mr-2" />, label: "User Management", roles: ['admin'] },
    { to: "/profile", icon: <User className="w-4 h-4 mr-2" />, label: "Profile" },
    { to: "/settings", icon: <Settings className="w-4 h-4 mr-2" />, label: "Settings" },
  ];

  return (
    <nav className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="text-xl font-bold mb-6">RoofClaim AI</div>
      <ul className="space-y-2">
        {navItems.map((item) => (
          (!item.roles || item.roles.includes(userRole)) && (
            <li key={item.to}>
              <Link to={item.to} className="flex items-center py-2 px-4 hover:bg-gray-700 rounded transition-colors duration-200">
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          )
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <Button onClick={signOut} variant="outline" className="w-full text-white bg-[#4bd1a0] hover:bg-[#3ca880] transition-colors duration-200">
          Log Out
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;
