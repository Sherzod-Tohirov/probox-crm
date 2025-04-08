import { memo } from "react";
import classNames from "classnames";
import styles from "./list.module.scss";
import Item from "../Item";

function List({
  items,
  renderItem,
  onSelect,
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
  return (
    <ul
      style={listStyles}
      className={classNames(styles.list, className)}
      {...props}>
      {items.map((item, index) => (
        <Item
          className={itemClassName}
          key={index}
          onClick={() => onSelect(item)}>
          {renderItem(item, index)}
        </Item>
      ))}
    </ul>
  );
}

export default memo(List);
