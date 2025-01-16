import { memo } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./list.module.scss";
import Item from "../Item";

function List({
  items,
  renderItem,
  className,
  direction = "horizontal",
  itemClassName = "",
  ...props
}) {
  const listStyles = {
    display: "flex",
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

List.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  className: PropTypes.string,
  itemClassName: PropTypes.string,
  direction: PropTypes.oneOf(["horizontal", "vertical"]),
};

export default memo(List);
