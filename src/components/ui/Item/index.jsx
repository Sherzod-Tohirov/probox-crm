import { memo } from "react";
import PropTypes from "prop-types";

const Item = ({ children, className, ...props }) => {
  return (
    <li className={className} {...props}>
      {children}
    </li>
  );
};

Item.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Item.defaultProps = {
  className: "",
};

export default memo(Item);
