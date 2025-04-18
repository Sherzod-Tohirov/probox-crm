import { memo, useState } from "react";
import classNames from "classnames";
import styles from "./list.module.scss";
import Item from "../Item";
import Box from "../Box";
import iconsMap from "@utils/iconsMap";
import { AnimatePresence, motion } from "framer-motion";
function List({
  items,
  renderItem,
  onSelect,
  isCollapsible = false,
  gutter,
  className,
  direction = "column",
  itemClassName = "",
  style = {},
  ...props
}) {
  const listStyles = {
    display: "flex",
    gap: `${gutter}rem`,
    flexDirection: direction,
    ...style,
  };
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Box dir="column" align={"start"}>
      <motion.ul
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, stiffness: 100 }}
        style={listStyles}
        className={classNames(
          styles.list,
          className,
          isCollapsible
            ? isExpanded
              ? styles["expanded"]
              : styles["shrinked"]
            : ""
        )}
        {...props}>
        <AnimatePresence>
          {items.map((item, index) => (
            <Item
              className={itemClassName}
              key={index}
              onClick={() => onSelect(item)}>
              {renderItem(item, index)}
            </Item>
          ))}
        </AnimatePresence>
      </motion.ul>

      {isCollapsible && items?.length > 1 ? (
        <>
          {!isExpanded ? <span className={styles["dots"]}>...</span> : null}
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
              duration: 0.1,
            }}
            className={styles["toggle-button"]}
            onClick={() => setIsExpanded((p) => !p)}>
            {isExpanded ? (
              <>{iconsMap["arrowUp"]} Yopish</>
            ) : (
              <>{iconsMap["arrowDown"]} Davomini ko'rish</>
            )}
          </motion.button>
        </>
      ) : null}
    </Box>
  );
}

export default memo(List);
