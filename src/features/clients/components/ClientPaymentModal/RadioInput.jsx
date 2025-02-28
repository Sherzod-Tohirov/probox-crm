import { forwardRef } from "react";
import styles from "./clientPaymentModal.module.scss";
import iconsMap from "@utils/iconsMap";

function RadioInput({ label, icon, id, ...props }, ref) {
  return (
    <div className={styles["radio-input-wrapper"]}>
      <input
        ref={ref}
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

export default forwardRef(RadioInput);
