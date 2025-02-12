import classNames from "classnames";
import styles from "./table.module.scss";
import iconsMap from "@utils/iconsMap";

export default function Table({
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
          {columns.map((column) => (
            <th key={column.key} style={{ width: column.width || "auto" }}>
              <div className={styles["table-header-cell"]}>
                {iconsMap[column.icon]} {column.title}{" "}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} onClick={() => onRowClick(row)}>
            {columns.map((column) => {
              return (
                <td key={column.key}>
                  {column.renderCell ? column.renderCell(row) : row[column.key]}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
