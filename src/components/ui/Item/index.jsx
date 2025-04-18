import { motion } from "framer-motion";
import { memo } from "react";

const Item = ({ children, className, ...props }) => {
  return (
    <motion.li className={className} {...props}>
      {children}
    </motion.li>
  );
};

export default memo(Item);
