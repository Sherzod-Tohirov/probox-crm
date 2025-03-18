import classNames from "classnames";
import styles from "./table.module.scss";
import iconsMap from "@utils/iconsMap";
import { memo } from "react";

function Table({
  columns = [],
  data = [],
  className,
  style = {},
  onRowClick = () => {},
}) {
  return (
    <table
      className={classNames(styles["base-table"], className)}
      style={style}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th
              // Use combination of key and index for uniqueness
              key={`header-${column.key}-${index}`}
              style={{ width: column.width || "auto" }}>
              <div className={styles["table-header-cell"]}>
                {column.icon && iconsMap[column.icon]} {column.title}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            // Use combination of id and index for uniqueness
            key={`row-${row.id}-${rowIndex}`}
            onClick={() => onRowClick(row)}>
            {columns.map((column, colIndex) => (
              <td
                // Use combination of all relevant ids for uniqueness
                key={`cell-${row.id}-${column.key}-${colIndex}`}>
                {column.renderCell ? column.renderCell(row) : row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default memo(Table);
