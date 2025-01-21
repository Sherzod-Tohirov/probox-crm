import { memo } from "react";
import classNames from "classnames";
import styles from "./list.module.scss";
import Item from "../Item";

function List({
  items,
  renderItem,
  gutter,
  className,
  direction = "vertical",
  itemClassName = "",
  ...props
}) {
  const listStyles = {
    display: "flex",
    gap: `${gutter}rem`,
    flexDirection: direction === "horizontal" ? "row" : "column",
  };
  return (
    <ul
      style={listStyles}
      className={classNames(styles.list, className)}
      {...props}>
      {items.map((item, index) => (
        <Item className={itemClassName} key={index}>
          {renderItem(item)}
        </Item>
      ))}
    </ul>
  );
}

export default memo(List);
