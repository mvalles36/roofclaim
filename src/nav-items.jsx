import { Home, Users, FileText, Settings, BarChart2, Mail, Phone, Calendar } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import DocumentHub from './pages/DocumentHub';
import Settings from './pages/Settings';
import SalesManagerDashboard from './pages/SalesManagerDashboard';
import EmailInbox from './components/EmailInbox';
import WebsiteVisitors from './components/WebsiteVisitors';

export const navItems = [
  { icon: Home, label: 'Dashboard', component: Dashboard },
  { icon: Users, label: 'Contacts', component: Contacts },
  { icon: FileText, label: 'Document Hub', component: DocumentHub },
  { icon: BarChart2, label: 'Sales Dashboard', component: SalesManagerDashboard },
  { icon: Mail, label: 'Email Inbox', component: EmailInbox },
  { icon: Calendar, label: 'Website Visitors', component: WebsiteVisitors },
  { icon: Settings, label: 'Settings', component: Settings },
];
