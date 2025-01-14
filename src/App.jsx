import "@assets/styles/globals.scss";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <div>Hello World</div>
      <Outlet />
    </div>
  );
}

export default App;
