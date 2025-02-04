import styles from "@assets/styles/modules/layout.module.scss";
import useToggle from "../hooks/useToggle";
import classNames from "classnames";

export default function SidebarLayout({ children }) {
  const { isOpen } = useToggle("sidebar");
  return (
    <aside
      className={classNames(styles["sidebar-layout"], {
        [styles["open"]]: isOpen,
      })}>
      {children}
    </aside>
  );
}
