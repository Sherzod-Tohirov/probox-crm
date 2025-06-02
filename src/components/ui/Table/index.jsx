import { ClipLoader } from "react-spinners";
import { useCallback, useMemo, useRef, forwardRef, memo } from "react";
import iconsMap from "@utils/iconsMap";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import styles from "./table.module.scss";

// Memoized table cell component
const TableCell = memo(({ column, row, rowIndex }) => {
  const content = column.renderCell
    ? column.renderCell(row, rowIndex)
    : row[column.key];

  return <td style={column?.cellStyle || {}}>{content}</td>;
});

// Memoized table row component
const TableRow = memo(
  ({
    row,
    columns,
    rowIndex,
    uniqueKey,
    onRowClick,
    getRowStyles,
    handleMouseDown,
    handleMouseUp,
  }) => {
    const handleClick = useCallback(() => {
      onRowClick(row);
    }, [row, onRowClick]);

    const uniqueKeyValue = useMemo(() => {
      if (Array.isArray(uniqueKey)) {
        return uniqueKey.map((key) => row[key]).join("-");
      }
      return uniqueKey ? row[uniqueKey] : uuidv4();
    }, [row, uniqueKey]);

    return (
      <tr
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        style={getRowStyles(row)}>
        {columns.map((column, colIndex) => (
          <TableCell
            key={`${uniqueKeyValue}-${column.key}-${colIndex}`}
            column={column}
            row={row}
            rowIndex={rowIndex}
          />
        ))}
      </tr>
    );
  }
);

function Table(
  {
    uniqueKey = null,
    columns = [],
    data = [],
    className,
    style = {},
    containerStyle = {},
    containerClass,
    containerHeight = null,
    isLoading = false,
    showPivotColumn = false,
    scrollable = false,
    scrollHeight = "calc(100vh - 450px)",
    getRowStyles = () => ({}),
    onRowClick = () => {},
  },
  ref
) {
  const pressTimeRef = useRef(0);
  const allowRowClickRef = useRef(true);

  const finalColumns = useMemo(() => {
    if (!showPivotColumn) return columns;

    return [
      {
        key: "pivotId",
        icon: "barCodeFilled",
        title: "ID",
        width: "2%",
        cellStyle: { textAlign: "center" },
        renderCell: (_, rowIndex) => rowIndex + 1,
      },
      ...columns,
    ];
  }, [columns, showPivotColumn]);

  const handleMouseDown = useCallback(() => {
    pressTimeRef.current = Date.now();
    allowRowClickRef.current = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    const pressDuration = Date.now() - pressTimeRef.current;
    allowRowClickRef.current = pressDuration < 400;
  }, []);

  const memoizedRowClick = useCallback(
    (row) => {
      if (allowRowClickRef.current) {
        onRowClick(row);
      }
    },
    [onRowClick]
  );

  const containerClassName = useMemo(
    () =>
      classNames(
        styles["table-wrapper"],
        {
          [styles["scrollable"]]: scrollable,
          [styles["loading"]]: isLoading,
        },
        containerClass
      ),
    [scrollable, isLoading, containerClass]
  );

  const tableClassName = useMemo(
    () =>
      classNames(
        styles["base-table"],
        { [styles["loading"]]: isLoading },
        className
      ),
    [isLoading, className]
  );

  return (
    <div
      id="table-wrapper"
      data-testid="table-wrapper"
      style={{
        height: scrollable ? scrollHeight : containerHeight || "auto",
        ...containerStyle,
      }}
      className={containerClassName}>
      <div className={styles["table-container"]}>
        <table ref={ref} className={tableClassName} style={style}>
          <thead>
            <tr>
              {finalColumns.map((column, colIndex) => (
                <th
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
              <tr className={styles["loading-row"]}>
                <td
                  colSpan={finalColumns.length}
                  className={styles["empty-table"]}>
                  <ClipLoader color={"#94A3B8"} size={26} />
                </td>
              </tr>
            ) : data?.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow
                  key={`row-${rowIndex}`}
                  row={row}
                  columns={finalColumns}
                  rowIndex={rowIndex}
                  uniqueKey={uniqueKey}
                  onRowClick={memoizedRowClick}
                  getRowStyles={getRowStyles}
                  handleMouseDown={handleMouseDown}
                  handleMouseUp={handleMouseUp}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={finalColumns.length}
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

export default memo(forwardRef(Table));
