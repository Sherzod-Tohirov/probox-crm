import "react-toastify/dist/ReactToastify.css";
import styles from "@styles/modules/hook.module.scss";
import { Slide, toast, ToastContainer } from "react-toastify";
import { useCallback } from "react";
import { Alert } from "../components/ui";
export default function useAlert() {
  const alert = useCallback((message, options = {}) => {
    return toast(
      <Alert
        message={message}
        onClose={() => {
          typeof options.onClose === "function" &&
            options.onClose &&
            options.onClose();
        }}
        {...options}
      />,
      {
        type: "default",
        autoClose: options.autoClose || 5000,
        className: styles["alert-container"],
        progressClassName: styles["alert-progress"],
      }
    );
  }, []);

  const AlertContainer = () => {
    return (
      <ToastContainer
        toastClassName={styles["alert-container"]}
        progressClassName={styles["alert-progress"]}
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        closeButton={false}
        transition={Slide}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    );
  };

  return { alert, AlertContainer };
}
