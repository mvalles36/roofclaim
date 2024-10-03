import { Home, Users, FileText, Settings, Hammer, Mail, List, Robot, Search, Eye, MapPin, Globe, PieChart, IdCard } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import DocumentHub from './pages/DocumentHub';
import SettingsPage from './pages/Settings';
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
  { icon: Home, label: 'Dashboard', component: Dashboard },
  { icon: Home, label: 'Sales Manager Dashboard', component: SalesManagerDashboard },
  { icon: Home, label: 'Sales Dashboard', component: SalesDashboard },
  { icon: Home, label: 'Project Manager Dashboard', component: ProjectManagerDashboard },
  { icon: Home, label: 'Customer Success Dashboard', component: CustomerSuccessDashboard },
  { icon: Mail, label: 'Inbox', component: EmailInbox },
  { icon: List, label: 'Tasks', component: Tasks },
  { icon: Users, label: 'Contacts', component: Contacts },
  { icon: Hammer, label: 'Jobs', component: Jobs },
  { icon: Eye, label: 'Damage Detector', component: DamageDetection },
  { icon: Eye, label: 'Inspection Report', component: InspectionReport },
  { icon: Search, label: 'Prospect Finder', component: FindProspects },
  { icon: Robot, label: 'Sales GPT', component: SalesGPT },
  { icon: FileText, label: 'DocuHub', component: DocumentHub },
  { icon: MapPin, label: 'Tracker', component: Tracker },
  { icon: Globe, label: 'Website Visitors', component: WebsiteVisitors },
  { icon: Link, label: 'Client Portal', component: ClientPortal },
  { icon: Link, label: 'Contractor Portal', component: ContractorPortal },
  { icon: Link, label: 'Knowledge Base', component: KnowledgeBase },
  { icon: PieChart, label: 'Reports', component: Reports },
  { icon: PieChart, label: 'Estimate', component: SmartSupplement },
  { icon: Settings, label: 'Settings', component: SettingsPage },
  { icon: IdCard, label: 'Profile', component: Profile },
];
