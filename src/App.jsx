import '@assets/styles/globals.scss';
import 'react-loading-skeleton/dist/skeleton.css';

import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import SidebarLayout from '@layouts/SidebarLayout';
import MainLayout from '@layouts/MainLayout';
import DashboardLayout from '@layouts/DashboardLayout';
import PrimaryLayout from '@layouts/PrimaryLayout';

import Sidebar from '@components/Sidebar';
import Header from '@components/Header';
import Offline from '@pages/helper/Offline';
import InboundCallLeadModal from '@/features/leads/components/modals/InboundCallLeadModal';

import useAuth from '@hooks/useAuth';
import useAlert from '@hooks/useAlert';
import useToggle from '@hooks/useToggle';
import useTheme from '@hooks/useTheme';
import useOnlineStatus from '@hooks/useOnlineStatus';
import useAppUpdateChecker from '@hooks/useAppUpdateChecker';

import { isMessengerRoute } from '@utils/routesConfig';
import { setGlobalAlert } from '@utils/globalAlert';

// import { scan } from "react-scan/dist/index";
// scan({
//   enabled: true,
// });

function App() {
  const { AlertContainer, alert } = useAlert();
  const { isAuthenticated } = useAuth();
  const { isOpen, toggle } = useToggle('messenger');
  const location = useLocation();
  const isOnline = useOnlineStatus();

  // Initialize theme on app mount
  useTheme();
  useAppUpdateChecker();

  useEffect(() => {
    // Toggle off messenger when route changes
    if (!isMessengerRoute(location.pathname) && isOpen) toggle();
  }, [location.pathname, toggle, isOpen]);

  // Set the global alert handler once
  useEffect(() => {
    setGlobalAlert((message, options, onClose) => {
      alert(message, options, onClose);
    });
  }, [alert]);

  if (!isOnline) {
    return <Offline />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      <SidebarLayout>
        <Sidebar />
      </SidebarLayout>
      <PrimaryLayout>
        <Header />
        <DashboardLayout>
          <AnimatePresence mode="wait">
            <Outlet key={location.pathname} />
          </AnimatePresence>
        </DashboardLayout>
      </PrimaryLayout>
      <InboundCallLeadModal />
      <AlertContainer />
    </MainLayout>
  );
}

export default App;
