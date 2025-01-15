import styles from "@assets/styles/modules/layout.module.scss";

export default function SidebarLayout({ children }) {
  return <div className={styles["sidebar-layout"]}>{children}</div>;
}
