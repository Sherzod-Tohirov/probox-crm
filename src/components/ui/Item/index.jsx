import { motion } from "framer-motion";
import { memo } from "react";

const Item = ({ children, className, animated = false, ...props }) => {
  const Component = animated ? motion.li : "li";
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};

export default memo(Item);
