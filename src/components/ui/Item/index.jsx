import { memo } from "react";
const Item = ({ children, className, ...props }) => {
  return (
    <li className={className} {...props}>
      {children}
    </li>
  );
};

export default memo(Item);
