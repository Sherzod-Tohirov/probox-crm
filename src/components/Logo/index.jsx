import logoSmall from "@assets/images/logo-small.png";
import logo from "@assets/images/logo.png";
import { Link } from "react-router-dom";
import styles from "./logo.module.scss";
import { memo } from "react";
import classNames from "classnames";
function Logo({ isMinified = false }) {
  return (
    <div className={styles.logo}>
      <Link to={"/dashboard"}>
        <img
          className={classNames(
            styles["logo-img"],
            isMinified && styles["minified"]
          )}
          src={isMinified ? logoSmall : logo}
          alt="logo"
        />
      </Link>
    </div>
  );
}

export default memo(Logo);
