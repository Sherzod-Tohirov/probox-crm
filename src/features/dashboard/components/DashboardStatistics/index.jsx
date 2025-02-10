import styles from "./statistics.module.scss";

export default function DashboardStatistics({ children }) {
  return <div className={styles.statistics}>{children}</div>;
}
