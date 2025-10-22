import { Link, useLocation } from "react-router-dom";
import styles from "./breadcrumb.module.scss";
import { useCallback } from "react";
import List from "../List";
import classNames from "classnames";
import iconsMap from "@utils/iconsMap";
import { URL_PATH_LANG_MAP } from "../../../utils/constants";

export default function Breadcrumb({ customBreadcrumbs = null }) {
  const { pathname } = useLocation();

  const generateBreadcrumb = useCallback((pathname) => {
    const pathArray = pathname.split("/").filter((path) => path !== "");
    return pathArray.map((path, index) => {
      const fullPath = `/${pathArray.slice(0, index + 1).join("/")}`;
      const label =
        URL_PATH_LANG_MAP[path] ||
        path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
      return {
        path: fullPath,
        label,
        ...(pathArray.length - 1 === index ? { isLastPath: true } : {}),
        ...(index === 0 ? { isMainPath: true } : {}),
      };
    });
  }, []);

  const renderBreadcrumb = useCallback((breadcrumb) => {
    return (
      <Link
        className={classNames(
          styles["breadcrumb-link"],
          { [styles["main-link"]]: breadcrumb.isMainPath },
          { [styles["last-link"]]: breadcrumb.isLastPath }
        )}
        to={breadcrumb.path}>
        {breadcrumb.label} {breadcrumb.isMainPath ? " sahifasi " : ""}
        {!breadcrumb.isLastPath ? iconsMap["arrowRight"] : ""}
      </Link>
    );
  }, []);

  // Use custom breadcrumbs if provided, otherwise generate from URL
  const breadcrumbs = customBreadcrumbs || generateBreadcrumb(pathname);

  return (
    <List
      direction="row"
      className={styles["breadcrumb-list"]}
      items={breadcrumbs}
      renderItem={renderBreadcrumb}
    />
  );
}
