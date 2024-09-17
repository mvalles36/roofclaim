import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { supabase } from '../integrations/supabase/supabase';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { HomeIcon, UsersIcon, ClipboardIcon, FileTextIcon, MapPinIcon, BarChartIcon, UserIcon, SettingsIcon, LogOutIcon, CheckSquareIcon, BriefcaseIcon, CreditCardIcon, ListTodoIcon, ListCheckIcon, CameraIcon, FileIcon, ShieldIcon, ClipboardCheckIcon, FileSearchIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const { session, userRole, logout } = useSupabaseAuth();
  const [userName, setUserName] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      fetchUserName(session.user.id);
    }
  }, [session]);

  const fetchUserName = async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('name')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user name:', error);
    } else if (data) {
      setUserName(data.name);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navItems = [
    { icon: <HomeIcon className="h-5 w-5" />, label: 'Dashboard', to: '/' },
    { icon: <UsersIcon className="h-5 w-5" />, label: 'Contacts', to: '/contacts' },
    { icon: <UserIcon className="h-5 w-5" />, label: 'Customers', to: '/customers' },
    { icon: <BriefcaseIcon className="h-5 w-5" />, label: 'Jobs', to: '/jobs' },
    { icon: <CreditCardIcon className="h-5 w-5" />, label: 'Invoices', to: '/invoices' },
    { icon: <MapPinIcon className="h-5 w-5" />, label: 'Find Leads', to: '/find-leads' },
    { icon: <FileIcon className="h-5 w-5" />, label: 'Document Hub', to: '/document-hub' },
    { icon: <CameraIcon className="h-5 w-5" />, label: 'Damage Detection', to: '/damage-detection' },
    { icon: <ShieldIcon className="h-5 w-5" />, label: 'Insurance & Mortgage', to: '/insurance-mortgage-tracker' },
    { icon: <ClipboardCheckIcon className="h-5 w-5" />, label: 'Supplement Tracking', to: '/supplement-tracking' },
    { icon: <ListTodoIcon className="h-5 w-5" />, label: 'Tasks', to: '/tasks' },
    { icon: <FileSearchIcon className="h-5 w-5" />, label: 'Policy Comparison', to: '/policy-comparison' },
    { icon: <ClipboardIcon className="h-5 w-5" />, label: 'Inspections', to: '/inspections' },
    { icon: <FileTextIcon className="h-5 w-5" />, label: 'Inspection Report', to: '/inspection-report' },
  ];

  return (
    <nav className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="flex items-center mb-8">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src="/placeholder-avatar.jpg" alt={userName} />
          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="font-semibold">{userName}</span>
      </div>
      <ul className="space-y-2">
        {navItems.map((item, index) => (
          <li key={index}>
            <Link
              to={item.to}
              className={`flex items-center p-2 rounded hover:bg-gray-700 ${
                location.pathname === item.to ? 'bg-gray-700' : ''
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navigation;
