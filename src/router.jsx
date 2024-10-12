import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import DocumentHub from './pages/DocumentHub';
import EmailInbox from './pages/EmailInbox';
import Jobs from './pages/Jobs';
import SalesGPT from './pages/SalesGPT';
import Tasks from './pages/Tasks';
import KnowledgeBase from './pages/KnowledgeBase';
import FindProspects from './pages/FindProspects';
import Settings from './pages/Settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'contacts', element: <Contacts /> },
      { path: 'documents', element: <DocumentHub /> },
      { path: 'email-inbox', element: <EmailInbox /> },
      { path: 'jobs', element: <Jobs /> },
      { path: 'sales-gpt', element: <SalesGPT /> },
      { path: 'tasks', element: <Tasks /> },
      { path: 'knowledge-base', element: <KnowledgeBase /> },
      { path: 'find-prospects', element: <FindProspects /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);

export default router;