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
import DocumentEditor from './pages/DocumentEditor';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import DamageDetection from './pages/DamageDetection';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'contacts', element: <Contacts /> },
      { path: 'documents', element: <DocumentHub /> },
      { path: 'document-editor/:type', element: <DocumentEditor /> },
      { path: 'email-inbox', element: <EmailInbox /> },
      { path: 'jobs', element: <Jobs /> },
      { path: 'sales-gpt', element: <SalesGPT /> },
      { path: 'tasks', element: <Tasks /> },
      { path: 'knowledge-base', element: <KnowledgeBase /> },
      { path: 'find-prospects', element: <FindProspects /> },
      { path: 'damage-detection', element: <DamageDetection /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  { path: '/sign-in', element: <SignIn /> },
  { path: '/sign-up', element: <SignUp /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
]);

export default router;