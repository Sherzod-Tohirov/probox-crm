import Typography from "../Typography";
import styles from "./messenger.module.scss";

export default function Messenger() {
  return (
    <div className={styles.messenger}>
      <div className={styles["messenger-header"]}>
        <Typography
          element="h2"
          style={{ fontSize: "10rem" }}
          className={styles.title}>
          Messenger
        </Typography>
      </div>
      <div className={styles["messenger-body"]}>

      </div>
      <div className={styles["messenger-footer"]}>
        
      </div>
    </div>
  );
}
