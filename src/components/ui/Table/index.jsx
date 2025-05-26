import { ClipLoader } from "react-spinners";
import { useCallback, useRef } from "react";
import iconsMap from "@utils/iconsMap";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";

import styles from "./table.module.scss";
function Table({
  uniqueKey = null,
  columns = [],
  data = [],
  className,
  style = {},
  containerStyle = {},
  containerClass,
  isLoading = false,
  showPivotColumn = false,
  scrollable = false,
  scrollHeight = "calc(100vh - 450px)",
  getRowStyles = () => ({}),
  onRowClick = () => {},
}) {
  const pressTimeRef = useRef(0);
  const allowRowClickRef = useRef(true);

  const finalColumns = showPivotColumn
    ? [
        {
          key: "pivotId",
          icon: "barCodeFilled",
          title: "ID",
          width: "2%",
          cellStyle: {
            textAlign: "center",
          },
          renderCell: (_, rowIndex) => rowIndex + 1,
        },
        ...columns,
      ]
    : columns;

  const handleMouseDown = useCallback(() => {
    pressTimeRef.current = Date.now();
    allowRowClickRef.current = true;
  }, [allowRowClickRef, pressTimeRef]);

  const handleMouseUp = useCallback(() => {
    const pressDuration = Date.now() - pressTimeRef.current;
    allowRowClickRef.current = pressDuration < 400; // Disable row click if pressed for more than 200ms
  }, [allowRowClickRef, pressTimeRef]);

  const handleRowClick = useCallback(
    (row) => {
      if (allowRowClickRef.current) {
        onRowClick(row);
      }
    },
    [allowRowClickRef]
  );

  return (
    <div
      style={{ height: scrollable ? scrollHeight : "auto" }}
      className={classNames(styles["table-wrapper"], {
        [styles["scrollable"]]: scrollable,
      })}>
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
              {finalColumns.map((column, colIndex) => (
                <th
                  // Use combination of key and index for uniqueness
                  key={`header-${column.key}-${colIndex}`}
                  style={{
                    width: column.width || "auto",
                    minWidth: column.minWidth || "initial",
                    maxWidth: column.maxWidth || "initial",
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
              <tr key={`pivot-${uniqueKey}`} className={styles["loading-row"]}>
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
                    key={`row-${uniqueKey ? row[uniqueKey] : uuidv4()}`} // Ensure unique key for each row
                    onClick={() => handleRowClick(row)}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchEnd={handleMouseUp}
                    style={{ ...getRowStyles(row) }}>
                    {finalColumns.map((column, colIndex) => (
                      <td
                        style={{
                          ...(column?.cellStyle ? column.cellStyle : {}),
                        }}
                        key={`cell-${
                          uniqueKey ? `${row[uniqueKey]}-${colIndex}` : uuidv4()
                        }`} // Ensure unique key for each cell
                      >
                        {column.renderCell
                          ? column.renderCell(row, rowIndex)
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
                      Ma'lumot mavjud emas.
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
