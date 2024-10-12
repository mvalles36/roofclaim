import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import DocumentHub from './pages/DocumentHub';
import EmailInbox from './pages/EmailInbox';
import Jobs from './pages/Jobs';
import SalesGPT from './pages/SalesGPT';

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
    ],
  },
]);

export default router;