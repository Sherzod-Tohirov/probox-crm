import { useCallback, useState } from "react";
import { Alert } from "../components/ui";

export default function useAlert() {
  const [alertProps, setAlertProps] = useState({});

  const alert = useCallback((message, options = {}) => {
    setAlertProps({ message, ...options, open: true });
  }, []);

  const closeAlert = useCallback(() => {
    setAlertProps((prev) => ({ ...prev, open: false }));
  }, []);

  const AlertContainer = () => {
    return alertProps.open ? (
      <Alert {...alertProps} onClose={closeAlert} />
    ) : null;
  };

  return { alert, AlertContainer };
}
