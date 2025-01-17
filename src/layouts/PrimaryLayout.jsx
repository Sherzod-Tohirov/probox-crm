import styles from "@styles/modules/layout.module.scss";

export default function PrimaryLayout({ children }) {
  return <div className={styles["primary-layout"]}>{children}</div>;
}
