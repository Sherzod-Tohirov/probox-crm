import logoSmall from "@assets/images/logo-small.png";
import logo from "@assets/images/logo.png";
import { Link } from "react-router-dom";
import styles from "./logo.module.scss";
import { memo } from "react";
import classNames from "classnames";
function Logo({ isMinified = false }) {
  return (
    <div className={styles.logo}>
      <Link to={"/dashboard"} className={styles["logo-link"]}>
        <img
          className={classNames(
            styles["logo-img"],
            isMinified && styles["minified"]
          )}
          src={logo}
          alt="logo"
        />
        <img
          className={classNames(styles["logo-small-img"])}
          src={logoSmall}
          alt="logo"
        />
      </Link>
    </div>
  );
}

export default memo(Logo);
