import styles from "./footer.module.scss";

export default function Footer({ children }) {
  return <footer className={styles["footer"]}>{children}</footer>;
}
