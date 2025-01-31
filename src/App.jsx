import "@assets/styles/globals.scss";
import { Outlet } from "react-router-dom";
import SidebarLayout from "@layouts/SidebarLayout";
import Sidebar from "@components/Sidebar";
import MainLayout from "@layouts/MainLayout";
import DashboardLayout from "@layouts/DashboardLayout";
import PrimaryLayout from "@layouts/PrimaryLayout";
import Header from "@components/Header";
import useAlert from "@hooks/useAlert";
import Messenger from "./components/ui/Messenger";
import { Col, Row } from "./components/ui";

function App() {
  const { AlertContainer } = useAlert();
  return (
    <MainLayout>
      <SidebarLayout>
        <Sidebar />
      </SidebarLayout>
      <PrimaryLayout>
        <Header />
        <Row direction="row" flexGrow>
          <Col flexGrow>
            <DashboardLayout>
              <Outlet />
            </DashboardLayout>
          </Col>
          <Col>
            <Messenger />
          </Col>
        </Row>
      </PrimaryLayout>
      <AlertContainer />
    </MainLayout>
  );
}

export default App;
