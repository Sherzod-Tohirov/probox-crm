import styles from "./clientPaymentModal.module.scss";
import iconsMap from "@utils/iconsMap";

export default function RadioInput({ label, icon, id, ...props }) {
  return (
    <div className={styles["radio-input-wrapper"]}>
      <input
        id={id}
        type="radio"
        className={styles["radio-input"]}
        {...props}
      />
      <label htmlFor={id} className={styles["radio-input-label"]}>
        {icon ? iconsMap[icon] : ""}
        {label}
      </label>
    </div>
  );
}
