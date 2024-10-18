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

const router = createBrowserRouter([
  {
    path: '/',
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
    ],
  },
]);

export default router;