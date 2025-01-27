import { Link, useNavigate } from "react-router-dom";
import Button from "../Button";
import styles from "./navigation.module.scss";
import Breadcrumb from "../Breadcrumb";
import Divider from "../Divider";
import iconsMap from "../../../utils/iconsMap";

export default function Navigation() {
  const navigate = useNavigate();
  return (
    <nav className={styles.navigation}>
      <Button
        className={styles["navigation-back-btn"]}
        variant={"text"}
        onClick={() => navigate(-1)}
        icon={"arrowLeft"}>
        Back
      </Button>
      <Divider color="secondary" height={"12px"} />
      <Breadcrumb />
    </nav>
  );
}
