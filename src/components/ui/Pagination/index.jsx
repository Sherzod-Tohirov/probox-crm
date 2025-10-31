import ReactPaginate from "react-paginate";
import styles from "./pagination.module.scss";
import classNames from "classnames/bind";

export default function Pagination({ pageCount, onPageChange, activePage }) {
  return (
    <ReactPaginate
      previousLabel={pageCount > 0 && "Oldingi"}
      nextLabel={pageCount > 0 && "Keyingi"}
      breakLabel={"..."}
      breakClassName={styles["page"]}
      pageCount={pageCount || 0}
      onPageChange={pageCount > 0 ? onPageChange : () => {}}
      {...(pageCount > 0
        ? { forcePage: Math.min(activePage ?? 0, (pageCount || 1) - 1) }
        : {})}
      marginPagesDisplayed={1}
      pageRangeDisplayed={2}
      containerClassName={styles["pagination"]}
      activeLinkClassName={classNames(styles["page"], styles["active"])}
      pageLinkClassName={styles["page"]}
      disabledClassName={styles["disabled"]}
      previousClassName={styles["indicator"]}
      nextClassName={styles["indicator"]}
    />
  );
}
