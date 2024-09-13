import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { supabase } from '../integrations/supabase/supabase';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { HomeIcon, UsersIcon, ClipboardIcon, FileTextIcon, MapPinIcon, CalendarIcon, BarChartIcon, UserIcon, SettingsIcon, LogOutIcon, CheckSquareIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const { session, userRole, logout } = useSupabaseAuth();
  const [userName, setUserName] = useState('');
  const location = useLocation();

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

  const navItems = [
    { role: ['customer', 'employee', 'admin'], icon: <HomeIcon className="h-5 w-5" />, label: 'Dashboard', to: '/' },
    { role: ['employee', 'admin'], icon: <ClipboardIcon className="h-5 w-5" />, label: 'Inspections', to: '/inspection-scheduling' },
    { role: ['employee', 'admin'], icon: <FileTextIcon className="h-5 w-5" />, label: 'Claims', to: '/claim-management' },
    { role: ['employee', 'admin'], icon: <UsersIcon className="h-5 w-5" />, label: 'Contacts', to: '/contacts' },
    { role: ['customer', 'employee', 'admin'], icon: <CalendarIcon className="h-5 w-5" />, label: 'Calendar', to: '/calendar' },
    { role: ['admin'], icon: <MapPinIcon className="h-5 w-5" />, label: 'Find Leads', to: '/find-leads' },
    { role: ['employee', 'admin'], icon: <BarChartIcon className="h-5 w-5" />, label: 'Supplements', to: '/supplement-tracking' },
    { role: ['employee', 'admin'], icon: <CheckSquareIcon className="h-5 w-5" />, label: 'Tasks', to: '/tasks' },
  ];

  if (!session) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white w-64">
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">RoofCare Assist</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-10 h-10 rounded-full p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${userName}`} alt={userName} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 p-4">
          {navItems.map((item, index) => (
            item.role.includes(userRole) && (
              <li key={index}>
                <Link 
                  to={item.to} 
                  className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors ${location.pathname === item.to ? 'bg-gray-700' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;