import classNames from "classnames";
import styles from "./table.module.scss";
import iconsMap from "@utils/iconsMap";
import { ClipLoader } from "react-spinners";
import { v4 as uuidv4 } from "uuid";

function Table({
  columns = [],
  data = [],
  className,
  style = {},
  containerStyle = {},
  containerClass,
  isLoading = false,
  getRowStyles = () => ({}),
  onRowClick = () => {},
}) {
  return (
    <div
      style={containerStyle}
      className={classNames(styles["table-container"], containerClass)}>
      <table
        className={classNames(
          styles["base-table"],
          { [styles["loading"]]: isLoading },
          className
        )}
        style={style}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                // Use combination of key and index for uniqueness
                key={`header-${column.key}`}
                style={{
                  width: column.width || "auto",
                  minWidth: column.minWidth || "initial",
                }}>
                <div className={styles["table-header-cell"]}>
                  {column.icon && iconsMap[column.icon]} {column.title}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr className={styles["loading-row"]}>
              <td colSpan={columns.length} className={styles["empty-table"]}>
                <ClipLoader color={"#94A3B8"} />
              </td>
            </tr>
          ) : (
            ""
          )}
          {!isLoading && data?.length > 0
            ? data.map((row, rowIndex) => (
                <tr
                  key={`row-${uuidv4()}`} // Ensure unique key for each row
                  onClick={() => onRowClick(row)}
                  style={{ ...getRowStyles(row) }}>
                  {columns.map((column, colIndex) => (
                    <td
                      style={{ ...(column?.cellStyle ? column.cellStyle : {}) }}
                      key={`cell-${row.id || row.IntrSerial || rowIndex}-${
                        column.key || colIndex
                      }`} // Ensure unique key for each cell
                    >
                      {column.renderCell
                        ? column.renderCell(row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            : !isLoading && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className={styles["empty-table"]}>
                    No data available
                  </td>
                </tr>
              )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
