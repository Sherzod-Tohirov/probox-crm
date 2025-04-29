import "@assets/styles/globals.scss";
import "react-loading-skeleton/dist/skeleton.css";

import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import SidebarLayout from "@layouts/SidebarLayout";
import MainLayout from "@layouts/MainLayout";
import DashboardLayout from "@layouts/DashboardLayout";
import PrimaryLayout from "@layouts/PrimaryLayout";

import Messenger from "@components/ui/Messenger";
import Sidebar from "@components/Sidebar";
import Header from "@components/Header";

import useAuth from "@hooks/useAuth";
import useAlert from "@hooks/useAlert";
import useToggle from "@hooks/useToggle";

import { isMessengerRoute } from "@utils/routesConfig";
import { setGlobalAlert } from "@utils/globalAlert";

// import { scan } from "react-scan/dist/index";
// scan({
//   enabled: true,
// });

function App() {
  const { AlertContainer, alert } = useAlert();
  const { isAuthenticated } = useAuth();
  const { isOpen, toggle } = useToggle("messenger");
  const { pathname } = useLocation();

  useEffect(() => {
    // Toggle off messenger when route changes
    if (!isMessengerRoute(pathname) && isOpen) toggle();
  }, [pathname, toggle, isOpen]);

  // Set the global alert handler once
  useEffect(() => {
    setGlobalAlert((message, options, onClose) => {
      alert(message, options, onClose);
    });
  }, [alert]);

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
          <Outlet />
        </DashboardLayout>
        <Messenger />
      </PrimaryLayout>
      <AlertContainer />
    </MainLayout>
  );
}

export default App;
