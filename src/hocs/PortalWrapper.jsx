// PortalWrapper.tsx
import { createPortal } from "react-dom";

const PortalWrapper = ({ children }) => {
  if (typeof window === "undefined") return null;

  const portalRoot = document.getElementById("root-portal") || document.body;
  return createPortal(children, portalRoot);
};

export default PortalWrapper;
