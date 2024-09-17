import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { supabase } from '../integrations/supabase/supabase';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { HomeIcon, UsersIcon, ClipboardIcon, FileTextIcon, MapPinIcon, BarChartIcon, UserIcon, SettingsIcon, LogOutIcon, CheckSquareIcon, BriefcaseIcon, CreditCardIcon, ListTodoIcon, ListCheckIcon, CameraIcon, FilesIcon, DocumentIcon, HammerIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Import your DocumentHub component here
import DocumentHub from './DocumentHub.jsx'; // Replace with the actual path to your DocumentHub component

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
    { role: ['admin', 'sales', 'manager', 'support', 'supplement_specialist', 'roofing_crew_lead'], icon: <HomeIcon className="h-5 w-5" />, label: 'Dashboard', to: '/' },
    { role: ['admin', 'sales', 'manager'], icon: <UsersIcon className="h-5 w-5" />, label: 'Contacts', to: '/contacts' },
    { role: ['admin', 'sales', 'manager', 'support', 'supplement_specialist'], icon: <UserIcon className="h-5 w-5" />, label: 'Customers', to: '/customers' },
    { role: ['admin', 'sales', 'manager', 'roofing_crew_lead'], icon: <HammerIcon className="h-5 w-5" />, label: 'Jobs', to: '/jobs' },
    { role: ['admin','sales', 'manager'], icon: <CreditCardIcon className="h-5 w-5" />, label: 'Invoices', to: '/invoices' },
    { role: ['admin', 'manager'], icon: <MapPinIcon className="h-5 w-5" />, label: 'Find Leads', to: '/find-leads' },
    { role: ['admin', 'sales', 'manager', 'supplement_specialist'], icon: <FilesIcon className="h-5 w-5" />, label: 'Supplements', to: '/supplement-tracking' },
   
