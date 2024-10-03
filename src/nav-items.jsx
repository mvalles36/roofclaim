import { Home, Users, FileText, Settings, Hammer, Mail, List, Robot, Search, Eye, MapPin, Globe, PieChart, IdCard } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import DocumentHub from './pages/DocumentHub';
import SettingsPage from './pages/Settings'; // Ensure the casing matches
import Profile from './pages/Profile';
import SalesManagerDashboard from './pages/SalesManagerDashboard';
import EmailInbox from './components/EmailInbox';
import WebsiteVisitors from './components/WebsiteVisitors';
import Tasks from './pages/Tasks';
import Jobs from './pages/Jobs';
import FindProspects from './pages/FindProspects';
import DamageDetection from './pages/DamageDetection';
import SalesGPT from './pages/SalesGPT';
import AdminDashboard from './pages/AdminDashboard';
import ProjectManagerDashboard from './pages/ProjectManagerDashboard';
import CustomerSuccessDashboard from './pages/CustomerSuccessDashboard';
import SalesDashboard from './pages/SalesDashboard';
import Tracker from './pages/Tracker';
import Reports from './pages/Reports';
import ClientPortal from './pages/ClientPortal';
import ContractorPortal from './pages/ContractorPortal';
import UserManagement from './pages/UserManagement';
import SmartSupplement from './pages/SmartSupplement';
import ForgotPassword from './pages/ForgotPassword';
import KnowledgeBase from './pages/KnowledgeBase';
import InspectionReport from './pages/InspectionReport';

export const navItems = [
  { icon: Home, label: 'Dashboard', component: Dashboard, to: '/dashboard' },
  { icon: Home, label: 'Sales Manager Dashboard', component: SalesManagerDashboard, to: '/sales-manager-dashboard' },
  { icon: Home, label: 'Sales Dashboard', component: SalesDashboard, to: '/sales-dashboard' },
  { icon: Home, label: 'Project Manager Dashboard', component: ProjectManagerDashboard, to: '/project-manager-dashboard' },
  { icon: Home, label: 'Customer Success Dashboard', component: CustomerSuccessDashboard, to: '/customer-success-dashboard' },
  { icon: Mail, label: 'Inbox', component: EmailInbox, to: '/inbox' },
  { icon: List, label: 'Tasks', component: Tasks, to: '/tasks' },
  { icon: Users, label: 'Contacts', component: Contacts, to: '/contacts' },
  { icon: Hammer, label: 'Jobs', component: Jobs, to: '/jobs' },
  { icon: Eye, label: 'Damage Detector', component: DamageDetection, to: '/damage-detector' },
  { icon: Eye, label: 'Inspection Report', component: InspectionReport, to: '/inspection-report' },
  { icon: Search, label: 'Prospect Finder', component: FindProspects, to: '/prospect-finder' },
  { icon: Robot, label: 'Sales GPT', component: SalesGPT, to: '/sales-gpt' },
  { icon: FileText, label: 'DocuHub', component: DocumentHub, to: '/docuhub' },
  { icon: MapPin, label: 'Tracker', component: Tracker, to: '/tracker' },
  { icon: Globe, label: 'Website Visitors', component: WebsiteVisitors, to: '/website-visitors' },
  { icon: Link, label: 'Client Portal', component: ClientPortal, to: '/client-portal' },
  { icon: Link, label: 'Contractor Portal', component: ContractorPortal, to: '/contractor-portal' },
  { icon: Link, label: 'Knowledge Base', component: KnowledgeBase, to: '/knowledge-base' },
  { icon: PieChart, label: 'Reports', component: Reports, to: '/reports' },
  { icon: PieChart, label: 'Estimate', component: SmartSupplement, to: '/estimate' },
  { icon: Settings, label: 'Settings', component: SettingsPage, to: '/settings' },
  { icon: IdCard, label: 'Profile', component: Profile, to: '/profile' },
  // LogOut component is removed since it will be handled by a button
];
