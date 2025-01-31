import "./index.scss";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster
        position={"top-right"}
        reverseOrder={false}
        toastOptions={{
          className: "alert",
          duration: 4000,
          style: {
            background: "#363636",
            width: "100%",
            color: "#fff",
          },
        }}
      />
    </Provider>
  </StrictMode>
);
