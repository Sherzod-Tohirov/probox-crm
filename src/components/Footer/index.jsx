import styles from "./footer.module.scss";

export default function Footer({ children }) {
  return (
    <footer className={styles["footer"]}>
      <p className={styles["footer-text"]}>Footer</p>
      {children}
    </footer>
  );
}
