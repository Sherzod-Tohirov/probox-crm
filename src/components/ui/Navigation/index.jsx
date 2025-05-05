import { useLocation, useNavigate } from "react-router-dom";
import Button from "../Button";
import styles from "./navigation.module.scss";
import Breadcrumb from "../Breadcrumb";
import Divider from "../Divider";
import { useCallback, useRef } from "react";

export default function Navigation({ fallbackBackPath = "/" }) {
  const navigate = useNavigate();
  const hasNavigated = useRef(null);

  const handleBack = useCallback(() => {
    if (window.history.length > 2 && !hasNavigated.current) {
      hasNavigated.current = true;
      navigate(-1);
    } else {
      navigate(fallbackBackPath, { replace: true });
    }
  }, []);

  return (
    <nav className={styles.navigation}>
      <Button
        className={styles["navigation-back-btn"]}
        variant={"text"}
        onClick={handleBack}
        icon={"arrowLeft"}>
        Ortga
      </Button>
      <Divider color="secondary" height={"12px"} />
      <Breadcrumb />
    </nav>
  );
}
