import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import MainLayout from './Desktop/layouts/MainLayout';
import Dashboard from './Desktop/pages/Dashboard';
import POS from './Desktop/pages/POS';
import Services from './Desktop/pages/Services';
import Transactions from './Desktop/pages/Transactions';
import Settings from './Desktop/pages/Settings';
import SignIn from './Desktop/pages/SignIn';
import ForgotPassword from './Desktop/pages/ForgotPassword';
import PageNotFound from './Desktop/layouts/PageNotFound';
import Customers from './Desktop/pages/Customer';
import OutgoingPayments from './Desktop/pages/OutgoingPayments';
import OutgoingPaymentCategories from './Desktop/pages/OutgoingPaymentCategories';
import { PageTitleProvider } from './Desktop/layouts/PageTitleContext';
import ResetPassword from './Desktop/pages/ResetPassword';
// Mobile imports
import MobileSignIn from './Mobile/pages/MobileSignIn';
import MobileForgotPassword from './Mobile/pages/MobileForgotPassword';
import MobileIndex from './Mobile/layout/MobileIndex';
import MobilePos from './Mobile/pages/MobilePos';
import MobileDashboard from './Mobile/pages/MobileDashboard';
import MobileInventory from './Mobile/pages/MobileInventory';
import MobileTransaction from './Mobile/pages/MobileTransaction';
import MobileSetting from './Mobile/pages/MobileSetting';
import MobilePageNotFound from './Mobile/pages/MobilePageNotFound';
import MobileLostConnection from './Mobile/pages/MobileLostConnection';
import MobileUnderMaintenance from './Mobile/pages/MobileUnderMaintenance';
import MobileResetPassword from './Mobile/pages/MobileResetPassword';
import TransactionDetails from './Mobile/pages/TransactionDetails';
// Add more mobile pages as you create them

// A simple authentication check (replace with your actual auth logic)
const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

// Custom hook to detect if screen is mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

function App() {
  const isMobile = useIsMobile();
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <PageTitleProvider>
        <Router>
          <Routes>
            {isMobile ? (
              // Mobile routes
              <>
                <Route path="/signin" element={<MobileSignIn />} />
                <Route path="/forgot-password" element={<MobileForgotPassword />} />
                <Route path="/reset-password" element={<MobileResetPassword />} />
                <Route element={<MobileIndex />}>
                  <Route path="/dashboard" element={<MobileDashboard />} />
                  <Route path="/pos" element={<MobilePos />} />
                  <Route path="/customers" element={<MobileInventory />} />
                  <Route path="/transactions" element={<MobileTransaction />} />
                  <Route path="/transaction/:id" element={<TransactionDetails />} />
                  <Route path="/profile" element={<MobileSetting />} />
                </Route>
                <Route path="/404" element={<MobilePageNotFound />} />
                <Route path="/lost-connection" element={<MobileLostConnection />} />
                <Route path="/maintenance" element={<MobileUnderMaintenance />} />
                <Route path="/" element={<Navigate to="/signin" replace />} />
                <Route path="*" element={<MobilePageNotFound />} />
              </>
            ) : (
              // Desktop routes
              <>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/pagenotfound" element={<PageNotFound />} />
                <Route path="/dashboard" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
                <Route path="/pos" element={<ProtectedRoute><MainLayout><POS /></MainLayout></ProtectedRoute>} />
                <Route path="/services" element={<ProtectedRoute><MainLayout><Services /></MainLayout></ProtectedRoute>} />
                <Route path="/customers" element={<ProtectedRoute><MainLayout><Customers /></MainLayout></ProtectedRoute>} />
                <Route path="/transactions" element={<ProtectedRoute><MainLayout><Transactions /></MainLayout></ProtectedRoute>} />
                <Route path="/outgoing-payments" element={<ProtectedRoute><MainLayout><OutgoingPayments /></MainLayout></ProtectedRoute>} />
                <Route path="/outgoing-payment-categories" element={<ProtectedRoute><MainLayout><OutgoingPaymentCategories /></MainLayout></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><MainLayout><Settings /></MainLayout></ProtectedRoute>} />
                <Route path="/" element={<Navigate to="/signin" replace />} />
                <Route path="*" element={<Navigate to="/pagenotfound" replace />} />
              </>
            )}
          </Routes>
        </Router>
      </PageTitleProvider>
    </ConfigProvider>
  );
}

export default App;
