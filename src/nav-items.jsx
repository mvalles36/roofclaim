import { Home, MapPin, ClipboardList, Inbox, Briefcase, FileText, MessageSquare, Brain } from 'lucide-react';

export const navItems = [
  {
    name: "Home",
    href: "/",
    icon: Home
  },
  {
    name: "Find Prospects",
    href: "/find-prospects",
    icon: MapPin
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: ClipboardList
  },
  {
    name: "Inbox",
    href: "/email",
    icon: Inbox
  },
  {
    name: "Jobs",
    href: "/jobs",
    icon: Briefcase
  },
  {
    name: "Documents",
    href: "/documents",
    icon: FileText
  },
  {
    name: "Damage Detection",
    href: "/damage-detection",
    icon: MessageSquare
  },
  {
    name: "SalesGPT",
    href: "/sales-gpt",
    icon: Brain
  }
];