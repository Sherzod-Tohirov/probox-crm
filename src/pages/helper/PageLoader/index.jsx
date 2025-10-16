import { ClipLoader } from "react-spinners";
import styles from "./loader.module.scss";
import classNames from "classnames";
import { useEffect, useState } from "react";

export default function PageLoader({ fullscreen = false }) {
  const [loaderColor, setLoaderColor] = useState("#3b82f6");

  useEffect(() => {
    // Get current theme
    const theme = document.documentElement.getAttribute("data-theme");
    setLoaderColor(theme === "dark" ? "#60a5fa" : "#3b82f6");
  }, []);

  return (
    <div className={styles["page-overlay"]}>
      <div
        className={classNames(styles["page-loader"], {
          [styles.fullscreen]: fullscreen,
        })}>
        <ClipLoader color={loaderColor} loading={true} size={70} />
      </div>
    </div>
  );
}
