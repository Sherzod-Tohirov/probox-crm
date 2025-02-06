import iconsMap from "../../../../utils/iconsMap";
import styles from "./clientPageForm.module.scss";

export default function Label({ children, icon, ...props }) {
  return (
    <label className={styles.label} {...props}>
      {iconsMap[icon]}
      {children}
    </label>
  );
}
