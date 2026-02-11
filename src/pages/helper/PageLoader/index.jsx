import styles from "./loader.module.scss";
import classNames from "classnames";
import Skeleton from "@/components/ui/Skeleton";

export default function PageLoader({ fullscreen = false }) {
  return (
    <div className={styles["page-overlay"]}>
      <div
        className={classNames(styles["page-loader"], {
          [styles.fullscreen]: fullscreen,
        })}>
        <div className={styles["skeleton-wrapper"]}>
          <Skeleton height="30px" width="220px" borderRadius="10px" />
          <Skeleton height="14px" width="420px" />
          <Skeleton height="14px" width="360px" />
          <Skeleton height="140px" width="100%" borderRadius="12px" />
          <Skeleton height="140px" width="100%" borderRadius="12px" />
        </div>
      </div>
    </div>
  );
}
