import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { supabase } from '../integrations/supabase/supabase';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { HomeIcon, UsersIcon, ClipboardIcon, FileTextIcon, MapPinIcon, CalendarIcon, BarChartIcon, UserIcon, SettingsIcon, LogOutIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const { session, userRole, logout } = useSupabaseAuth();
  const [userName, setUserName] = useState('');

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
    { role: ['employee', 'admin'], icon: <BarChartIcon className="h-5 w-5" />, label: 'Policy Comparison', to: '/policy-comparison' },
  ];

  if (!session) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      <nav className="bg-white w-64 h-full shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">RoofCare Assist</h1>
        </div>
        <ul className="space-y-2 p-4">
          {navItems.map((item, index) => (
            item.role.includes(userRole) && (
              <li key={index}>
                <Link to={item.to} className="flex items-center space-x-3 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors">
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          ))}
        </ul>
      </nav>
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Main content will be rendered here */}
      </main>
      <div className="bg-white shadow-lg p-4 flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 rounded-full">
              <Avatar>
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
    </div>
  );
};

export default Navigation;