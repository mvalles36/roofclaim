import { Home, User, FileText, Settings, Hammer, Mail, ChartPie, Fullscreen, Webhook, Globe, Axe, Locate } from 'lucide-react';

export const navItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Mail, label: 'Email', path: '/email-inbox' },
  { icon: User, label: 'Contacts', path: '/contacts' },
  { icon: Hammer, label: 'Jobs', path: '/jobs' },
  { icon: Locate, label: 'Find', path: '/find-prospects' },
  { icon: Webhook, label: 'AI Assist', path: '/sales-gpt' },
  { icon: Fullscreen, label: 'Inspect', path: '/damage-detection' },
  { icon: FileText, label: 'eDocuments', path: '/document-hub' },
  { icon: Globe, label: 'Website Visitor Tracking', path: '/website-visitors' },
  { icon: Axe, label: 'Virtual Gong', path: '/index' },
  { icon: ChartPie, label: 'Reports', path: '/reports' },
  { icon: Settings, label: 'Settings', path: '/settings' },
