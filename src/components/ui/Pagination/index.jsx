import ReactPaginate from "react-paginate";
import styles from "./pagination.module.scss";
import classNames from "classnames/bind";

export default function Pagination({ pageCount, onPageChange, activePage }) {
  console.log("activePage", activePage);
  return (
    <ReactPaginate
      previousLabel={"Oldingi"}
      nextLabel={"Keyingi"}
      breakLabel={"..."}
      breakClassName={styles["page"]}
      pageCount={pageCount || 10}
      onPageChange={onPageChange}
      forcePage={activePage || 0}
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
