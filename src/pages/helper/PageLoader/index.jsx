import { ClipLoader } from "react-spinners";
import styles from "./loader.module.scss";
import classNames from "classnames";
export default function PageLoader({ fullscreen = false }) {
  return (
    <div className={styles["page-overlay"]}>
      <div
        className={classNames(styles["page-loader"], {
          [styles.fullscreen]: fullscreen,
        })}>
        <ClipLoader color={"#000"} loading={true} size={70} />
      </div>
    </div>
  );
}
