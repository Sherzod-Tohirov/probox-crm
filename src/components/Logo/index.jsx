import logoSmall from "@assets/images/logo-small.png";
import logo from "@assets/images/logo.png";
import { Link } from "react-router-dom";
import styles from "./logo.module.scss";
export default function Logo({ isMinified = false }) {
  return (
    <div className={styles.logo}>
      <Link to={"/dashboard"}>
        <img
          className={styles["logo-img"]}
          src={isMinified ? logoSmall : logo}
          alt="logo"
        />
      </Link>
    </div>
  );
}
