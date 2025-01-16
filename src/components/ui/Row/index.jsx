import PropTypes from "prop-types";
import styles from "./row.module.scss";
import { memo } from "react";
import classNames from "classnames";

// Row Component
function Row({
  children,
  gutter,
  direction = "horizontal",
  justify,
  align,
  wrap,
  className,
  style,
}) {
  const rowStyle = {
    display: "flex",
    flexDirection: direction === "horizontal" ? "row" : "column",
    flexWrap: wrap ? "wrap" : "nowrap",
    justifyContent: justify,
    alignItems: align,
    gap: gutter + "rem",
    ...style,
  };

  return (
    <div className={classNames(styles.row, className)} style={rowStyle}>
      {children}
    </div>
  );
}

Row.propTypes = {
  children: PropTypes.node.isRequired,
  gutter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Space between columns
  direction: PropTypes.oneOf(["horizontal", "vertical"]),
  justify: PropTypes.oneOf([
    "flex-start",
    "flex-end",
    "center",
    "space-between",
    "space-around",
    "space-evenly",
  ]),
  align: PropTypes.oneOf([
    "flex-start",
    "flex-end",
    "center",
    "stretch",
    "baseline",
  ]),
  wrap: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

Row.defaultProps = {
  gutter: "0",
  justify: "flex-start",
  align: "stretch",
  direction: "horizontal",
  wrap: true,
  className: "",
  style: {},
};

export default memo(Row);
