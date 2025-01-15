import { memo, useCallback, useMemo } from "react";

function Typography({ variant, element: Element = "p", children, ...props }) {
  const getVariantStyle = useCallback((variant) => {
    switch (variant) {
      case "h1":
        return { fontSize: "5rem", fontWeight: "bold" };
      case "h2":
        return { fontSize: "4rem", fontWeight: "bold" };
      case "h3":
        return { fontSize: "3rem", fontWeight: "bold" };
      case "p":
      default:
        return { fontSize: "3rem" };
    }
  }, []);

  const style = useMemo(
    () => getVariantStyle(variant),
    [variant, getVariantStyle]
  );

  return (
    <Element style={style} {...props}>
      {children}
    </Element>
  );
}

export default memo(Typography);
