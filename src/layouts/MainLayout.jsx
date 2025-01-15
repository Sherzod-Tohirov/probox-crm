import styles from "@assets/styles/modules/layout.module.scss";

export default function MainLayout({ children }) {
  return <div className={styles["main-layout"]}>{children}</div>;
}
