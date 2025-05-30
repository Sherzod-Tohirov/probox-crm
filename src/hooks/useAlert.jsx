import "react-toastify/dist/ReactToastify.css";
import styles from "@styles/modules/hook.module.scss";
import { Slide, toast, ToastContainer } from "react-toastify";
import { useCallback } from "react";
import { Alert } from "@components/ui";
import AlertManager from "@components/ui/Alert/AlertManager";

export default function useAlert() {
  const alert = useCallback((message, options = {}, onClose = () => {}) => {
    return AlertManager.show(
      <Alert
        message={message}
        onClose={() => {
          typeof options.onClose === "function" && options.onClose();
          onClose();
        }}
        {...options}
      />,
      {
        type: "default",
        autoClose: options.autoClose || 3000,
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
        autoClose={3000}
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
        style={{ zIndex: 9999999 }}
      />
    );
  };

  return { alert, AlertContainer };
}
