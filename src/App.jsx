import "@assets/styles/globals.scss";
import { Outlet } from "react-router-dom";
import SidebarLayout from "./layouts/SidebarLayout";
import Sidebar from "./components/Sidebar";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <MainLayout>
      <SidebarLayout>
        <Sidebar />
      </SidebarLayout>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </MainLayout>
  );
}

export default App;
