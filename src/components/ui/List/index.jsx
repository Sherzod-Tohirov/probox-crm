import { memo, useCallback, useState } from "react";
import classNames from "classnames";
import styles from "./list.module.scss";
import Item from "../Item";
import Box from "../Box";
import iconsMap from "@utils/iconsMap";
import { AnimatePresence, motion } from "framer-motion";

function List({
  items,
  renderItem,
  onSelect = () => {},
  isCollapsible = false,
  gutter = 0.5,
  className,
  direction = "column",
  itemClassName = "",
  style = {},
  itemProps = {},
  animated = false,
  ...props
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const listStyles = {
    display: "flex",
    flexDirection: direction,
    gap: `${gutter}rem`,
    ...style,
  };

  const renderList = useCallback(
    (items) =>
      items.map((item, index) => (
        <Item
          key={index}
          {...itemProps}
          className={classNames(styles.item, itemClassName)}
          onClick={() => onSelect(item)}>
          {renderItem(item, index)}
        </Item>
      )),
    [itemProps, itemClassName, onSelect, renderItem]
  );

  // const visibleItems = !isCollapsible
  //   ? items
  //   : isExpanded
  //   ? items
  //   : items.slice(0, 1);
  const ListComponent = animated ? motion.ul : "ul";
  return (
    <Box dir="column" align="start">
      <motion.div className={classNames(styles.listWrapper)}>
        <ListComponent
          style={listStyles}
          className={classNames(
            styles.list,
            isCollapsible
              ? isExpanded
                ? styles["expanded"]
                : styles["shrinked"]
              : null,
            className
          )}
          {...props}>
          <AnimatePresence initial={false}>{renderList(items)}</AnimatePresence>
        </ListComponent>
      </motion.div>

      {isCollapsible && items?.length > 1 && (
        <>
          {!isExpanded && <span className={styles["dots"]}>...</span>}
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
            }}
            className={styles["toggle-button"]}
            onClick={() => setIsExpanded((prev) => !prev)}>
            {isExpanded ? (
              <>{iconsMap["arrowUp"]} Yopish</>
            ) : (
              <>{iconsMap["arrowDown"]} Davomini ko'rish</>
            )}
          </motion.button>
        </>
      )}
    </Box>
  );
}

export default memo(List);
