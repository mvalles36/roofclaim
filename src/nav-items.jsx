import { Home, Users, FileText, Settings, Hammer, Mail, List, Bot, Search, Eye, MapPin, Globe, PieChart, UserCog } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import DocumentHub from './pages/DocumentHub';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import SalesManagerDashboard from './pages/SalesManagerDashboard';
import EmailInbox from './components/EmailInbox';
import WebsiteVisitors from './components/WebsiteVisitors';
import Tasks from './pages/Tasks';
import Jobs from './pages/Jobs';
import FindProspects from './pages/FindProspects';
import DamageDetection from './pages/DamageDetection';
import SalesGPT from './pages/SalesGPT';
import ProjectManagerDashboard from './pages/ProjectManagerDashboard';
import CustomerSuccessDashboard from './pages/CustomerSuccessDashboard';
import SalesDashboard from './pages/SalesDashboard';
import Tracker from './pages/Tracker';
import Reports from './pages/Reports';
import ClientPortal from './pages/ClientPortal';
import ContractorPortal from './pages/ContractorPortal';
import UserManagement from './pages/UserManagement';
import SmartSupplement from './pages/SmartSupplement';
import KnowledgeBase from './pages/KnowledgeBase';
import InspectionReport from './pages/InspectionReport';

export const navItems = [
  { icon: Home, label: 'Dashboard', component: Dashboard, roles: ['admin', 'sales_manager', 'sales', 'project_manager', 'customer_success'] },
  { icon: Home, label: 'Sales Manager Dashboard', component: SalesManagerDashboard, roles: ['sales_manager'] },
  { icon: Home, label: 'Sales Dashboard', component: SalesDashboard, roles: ['sales'] },
  { icon: Home, label: 'Project Manager Dashboard', component: ProjectManagerDashboard, roles: ['project_manager'] },
  { icon: Home, label: 'Customer Success Dashboard', component: CustomerSuccessDashboard, roles: ['customer_success'] },
  { icon: Mail, label: 'Inbox', component: EmailInbox, roles: ['admin', 'sales_manager', 'sales', 'project_manager', 'customer_success'] },
  { icon: List, label: 'Tasks', component: Tasks, roles: ['admin', 'sales_manager', 'sales', 'project_manager', 'customer_success'] },
  { icon: Users, label: 'Contacts', component: Contacts, roles: ['admin', 'sales_manager', 'sales', 'project_manager', 'customer_success'] },
  { icon: Hammer, label: 'Jobs', component: Jobs, roles: ['admin', 'sales_manager', 'sales', 'project_manager', 'customer_success'] },
  { icon: Eye, label: 'Damage Detector', component: DamageDetection, roles: ['admin', 'sales_manager', 'sales', 'project_manager'] },
  { icon: Eye, label: 'Inspection Report', component: InspectionReport, roles: ['admin', 'sales_manager', 'sales', 'project_manager'] },
  { icon: Search, label: 'Prospect Finder', component: FindProspects, roles: ['admin', 'sales_manager', 'sales'] },
  { icon: Bot, label: 'Sales GPT', component: SalesGPT, roles: ['admin', 'sales_manager', 'sales'] },
  { icon: FileText, label: 'DocuHub', component: DocumentHub, roles: ['admin', 'sales_manager', 'sales', 'project_manager', 'customer_success'] },
  { icon: MapPin, label: 'Tracker', component: Tracker, roles: ['admin', 'sales_manager', 'sales', 'project_manager', 'customer_success'] },
  { icon: Globe, label: 'Website Visitors', component: WebsiteVisitors, roles: ['admin', 'sales_manager', 'sales'] },
  { icon: PieChart, label: 'Reports', component: Reports, roles: ['admin', 'sales_manager', 'project_manager', 'customer_success'] },
  { icon: PieChart, label: 'Smart Supplement', component: SmartSupplement, roles: ['admin', 'sales_manager', 'sales', 'project_manager'] },
  { icon: Settings, label: 'Settings', component: Settings, roles: ['admin', 'sales_manager', 'sales', 'project_manager', 'customer_success'] },
  { icon: UserCog, label: 'Profile', component: Profile, roles: ['admin', 'sales_manager', 'sales', 'project_manager', 'customer_success'] },
  { icon: UserCog, label: 'User Management', component: UserManagement, roles: ['admin'] },
  { icon: FileText, label: 'Knowledge Base', component: KnowledgeBase, roles: ['admin', 'sales_manager', 'sales', 'project_manager', 'customer_success'] },
];