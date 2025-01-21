import styles from "@assets/styles/modules/layout.module.scss";
import useSidebar from "../hooks/useSidebar";
import classNames from "classnames";

export default function SidebarLayout({ children }) {
  const { isOpen } = useSidebar();
  return (
    <aside
      className={classNames(styles["sidebar-layout"], {
        [styles["open"]]: isOpen,
      })}>
      {children}
    </aside>
  );
}
