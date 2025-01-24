import ReactPaginate from "react-paginate";
import styles from "./pagination.module.scss";
import classNames from "classnames/bind";

export default function Pagination() {
  return (
    <ReactPaginate
      previousLabel={"Prev"}
      nextLabel={"Next"}
      breakLabel={"..."}
      breakClassName={styles["page"]}
      pageCount={10}
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
