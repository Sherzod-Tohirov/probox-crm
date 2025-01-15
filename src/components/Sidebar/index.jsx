import Logo from "../Logo";
import styles from "./sidebar.module.scss";
export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
    </div>
  );
}
