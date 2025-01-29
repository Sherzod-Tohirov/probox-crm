import "@assets/styles/globals.scss";
import { Outlet } from "react-router-dom";
import SidebarLayout from "@layouts/SidebarLayout";
import Sidebar from "@components/Sidebar";
import MainLayout from "@layouts/MainLayout";
import DashboardLayout from "@layouts/DashboardLayout";
import PrimaryLayout from "@layouts/PrimaryLayout";
import Header from "@components/Header";
import useAlert from "@hooks/useAlert";

function App() {
  const { AlertContainer } = useAlert();
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
      </PrimaryLayout>
      <AlertContainer />
    </MainLayout>
  );
}

export default App;
