import "@assets/styles/globals.scss";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SidebarLayout from "@layouts/SidebarLayout";
import Sidebar from "@components/Sidebar";
import MainLayout from "@layouts/MainLayout";
import DashboardLayout from "@layouts/DashboardLayout";
import PrimaryLayout from "@layouts/PrimaryLayout";
import Header from "@components/Header";
import useAlert from "@hooks/useAlert";
import Messenger from "./components/ui/Messenger";
import { Col, Row } from "./components/ui";
import useToggle from "./hooks/useToggle";
import { useEffect } from "react";
import { isMessengerRoute } from "./utils/routesConfig";
import useAuth from "./hooks/useAuth";

function App() {
  const { AlertContainer } = useAlert();
  const { isAuthenticated } = useAuth();
  const { isOpen, toggle } = useToggle("messenger");
  const { pathname } = useLocation();

  useEffect(() => {
    // Toggle off messenger when route changes
    if (!isMessengerRoute(pathname) && isOpen) toggle();
  }, [pathname, toggle, isOpen]);

  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }

  return (
    <MainLayout>
      <SidebarLayout>
        <Sidebar />
      </SidebarLayout>
      <PrimaryLayout>
        <Header />
        <Row direction="row" flexGrow>
          <Col
            flexGrow
            style={{ width: isOpen ? "calc(100% - (356px + 32px))" : "100%" }}>
            <DashboardLayout>
              <Outlet />
            </DashboardLayout>
          </Col>
          <Col
            style={{
              position: "sticky",
              top: "83px",
              marginLeft: "auto",
              height: "100vh",
            }}>
            <Messenger />
          </Col>
        </Row>
      </PrimaryLayout>
      <AlertContainer />
    </MainLayout>
  );
}

export default App;
