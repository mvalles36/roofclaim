import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Jobs from './pages/Jobs';
import DocumentHub from './pages/DocumentHub';
import EmailInbox from './pages/EmailInbox';
import Calendar from './pages/Calendar';
import DamageDetection from './pages/DamageDetection';
import Settings from './pages/Settings';
import FindProspects from './pages/FindProspects';
import Tasks from './pages/Tasks';
import SalesGPT from './pages/SalesGPT';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/contacts',
        element: <Contacts />,
      },
      {
        path: '/jobs',
        element: <Jobs />,
      },
      {
        path: '/documents',
        element: <DocumentHub />,
      },
      {
        path: '/email',
        element: <EmailInbox />,
      },
      {
        path: '/calendar',
        element: <Calendar />,
      },
      {
        path: '/damage-detection',
        element: <DamageDetection />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
      {
        path: '/find-prospects',
        element: <FindProspects />,
      },
      {
        path: '/tasks',
        element: <Tasks />,
      },
      {
        path: '/sales-gpt',
        element: <SalesGPT />,
      }
    ],
  },
]);

export default router;