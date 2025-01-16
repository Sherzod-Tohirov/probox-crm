import { memo } from "react";
import PropTypes from "prop-types";

const Item = ({ children, className, ...props }) => {
  return (
    <li className={className} {...props}>
      {children}
    </li>
  );
};

export default memo(Item);
