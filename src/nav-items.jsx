import { Home, Users, FileText, Mail, Briefcase, Bot, Settings, Book, ListTodo, Search } from 'lucide-react';

export const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Email Inbox', href: '/email-inbox', icon: Mail },
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'SalesGPT', href: '/sales-gpt', icon: Bot },
  { name: 'Tasks', href: '/tasks', icon: ListTodo },
  { name: 'Knowledge Base', href: '/knowledge-base', icon: Book },
  { name: 'Find Prospects', href: '/find-prospects', icon: Search },
  { name: 'Settings', href: '/settings', icon: Settings },
];