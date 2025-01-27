import styles from "@assets/styles/modules/layout.module.scss";

export default function DashboardLayout({ children }) {
  return <main className={styles["dashboard-layout"]}>{children}</main>;
}
