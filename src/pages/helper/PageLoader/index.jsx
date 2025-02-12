import { ClipLoader } from "react-spinners";
import styles from "./loader.module.scss";
import classNames from "classnames";
export default function PageLoader({ fullscreen = false }) {
  return (
    <div
      className={classNames(styles["page-loader"], {
        [styles.fullscreen]: fullscreen,
      })}>
      <ClipLoader color={"#7e7c7cf9"} loading={true} size={65} />
    </div>
  );
}
