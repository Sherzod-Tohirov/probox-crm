import styles from "@assets/styles/modules/layout.module.scss";

export default function SidebarLayout({ children }) {
  return <aside className={styles["sidebar-layout"]}>{children}</aside>;
}
