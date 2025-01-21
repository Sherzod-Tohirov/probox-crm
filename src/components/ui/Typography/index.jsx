import { memo } from "react";

function Typography({ element: Element = "p", children, ...props }) {
  return <Element {...props}>{children}</Element>;
}

export default memo(Typography);
