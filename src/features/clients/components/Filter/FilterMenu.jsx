// FilterMenu.jsx
import { FloatingPortal } from "@floating-ui/react";
import { motion } from "framer-motion";
import { forwardRef, memo } from "react";
import styles from "./filter.module.scss";
import iconsMap from "@utils/iconsMap";

const FilterMenu = forwardRef(function FilterMenu(
  { floatingStyles, onClose, menuList = [] },
  ref
) {
  return (
    <FloatingPortal>
      <motion.div
        ref={ref}
        className={styles["filter-menu-container"]}
        style={floatingStyles}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}>
        <ul className={styles["filter-menu-list"]}>
          {menuList.map((item) => (
            <li
              key={item.label}
              className={styles["filter-menu-item"]}
              onClick={() => {
                item.onClick?.();
                onClose?.();
              }}>
              {item.icon ? iconsMap[item.icon] : null}
              {item.label}
            </li>
          ))}
        </ul>
      </motion.div>
    </FloatingPortal>
  );
});

export default memo(FilterMenu);
