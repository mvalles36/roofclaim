// src/router.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import SalesManagerDashboard from './pages/SalesManagerDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Tracker from './pages/Tracker'; 
import Tasks from './pages/Tasks'; 
import SalesGPT from './pages/SalesGPT';
import Reports from './pages/Reports';
import ProjectManagerDashboard from './pages/ProjectManagerDashboard';
import Profile from './pages/Profile';
import Jobs from './pages/Jobs';
import Index from './pages/Index';
import FindProspects from './pages/FindProspects';
import DocumentHub from './pages/DocumentHub';
import DamageDetection from './pages/DamageDetection';
import CustomerSuccessDashboard from './pages/CustomerSuccessDashboard';
import ContractorPortal from './pages/ContractorPortal';
import Contacts from './pages/Contacts';
import ClientPortal from './pages/ClientPortal';
import KnowledgeBase from './pages/KnowledgeBase';
import DocumentEditor from './pages/DocumentEditor';
import InspectionReport from './pages/InspectionReport';
import Invoices from './pages/Invoices';
import SmartSupplement from './pages/SmartSupplement';

// Placeholder for missing pages
const LogOut = () => <div>Logging out...</div>;
const Unauthorized = () => <div>You do not have permission to view this page.</div>;

const Router = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/logout" element={<LogOut />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/sales-gpt" element={<SalesGPT />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/find-prospects" element={<FindProspects />} />
        <Route path="/document-hub" element={<DocumentHub />} />
        <Route path="/damage-detection" element={<DamageDetection />} />
        <Route path="/knowledge-base" element={<KnowledgeBase />} />
        <Route path="/document-editor" element={<DocumentEditor />} />
        <Route path="/inspection-report" element={<InspectionReport />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/smart-supplement" element={<SmartSupplement />} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales-manager-dashboard"
          element={
            <ProtectedRoute allowedRoles={['sales_manager']}>
              <SalesManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project-manager-dashboard"
          element={
            <ProtectedRoute allowedRoles={['project_manager']}>
              <ProjectManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer-success-dashboard"
          element={
            <ProtectedRoute allowedRoles={['customer_success']}>
              <CustomerSuccessDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client-portal"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <ClientPortal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contractor-portal"
          element={
            <ProtectedRoute allowedRoles={['contractor']}>
              <ContractorPortal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contacts"
          element={
            <ProtectedRoute allowedRoles={['admin', 'sales_manager']}>
              <Contacts />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default Router;
