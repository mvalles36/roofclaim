import {
  LayoutDashboard,
  Users,
  FileText,
  Mail,
  Calendar,
  Settings,
  Briefcase,
  FileSearch,
} from 'lucide-react';

export const navItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Contacts',
    href: '/contacts',
    icon: Users,
  },
  {
    name: 'Jobs',
    href: '/jobs',
    icon: Briefcase,
  },
  {
    name: 'Documents',
    href: '/documents',
    icon: FileText,
  },
  {
    name: 'Email',
    href: '/email',
    icon: Mail,
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: Calendar,
  },
  {
    name: 'Damage Detection',
    href: '/damage-detection',
    icon: FileSearch,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];