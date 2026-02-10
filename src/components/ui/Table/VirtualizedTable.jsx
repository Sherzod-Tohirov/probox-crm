import { ClipLoader } from "react-spinners";
import { useCallback, useRef, forwardRef, memo, useMemo } from "react";
import iconsMap from "@utils/iconsMap";
import classNames from "classnames";
import { FixedSizeList as List } from "react-window";
import styles from "./table.module.scss";

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
    rowHeight = 50,
  },
  ref
) {
  const pressTimeRef = useRef(0);
  const allowRowClickRef = useRef(true);

  const finalColumns = useMemo(() => {
    return showPivotColumn
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
  }, [columns, showPivotColumn]);

  const handleMouseDown = useCallback(() => {
    pressTimeRef.current = Date.now();
    allowRowClickRef.current = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    const pressDuration = Date.now() - pressTimeRef.current;
    allowRowClickRef.current = pressDuration < 400;
  }, []);

  const handleRowClick = useCallback(
    (row) => {
      if (allowRowClickRef.current) {
        onRowClick(row);
      }
    },
    [onRowClick]
  );

  const Row = memo(({ index, style: rowStyle }) => {
    const row = data[index];
    return (
      <tr
        key={`row-${uniqueKey ? row[uniqueKey] : index}`}
        onClick={() => handleRowClick(row)}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        style={{ ...getRowStyles(row), ...rowStyle }}
        role="row">
        {finalColumns.map((column, colIndex) => (
          <td
            role="cell"
            data-testid={`cell-${index}-${column.key}`}
            key={`cell-${index}-${colIndex}`}
            style={column.cellStyle || {}}>
            {column.renderCell
              ? column.renderCell(row, index)
              : row[column.key]}
          </td>
        ))}
      </tr>
    );
  });

  return (
    <div
      id="table-wrapper"
      data-testid="table-wrapper"
      style={{
        height: scrollable
          ? scrollHeight
          : containerHeight
          ? containerHeight
          : "auto",
        ...containerStyle,
      }}
      className={classNames(
        styles["table-wrapper"],
        {
          [styles["scrollable"]]: scrollable,
        },
        containerClass
      )}>
      <div className={classNames(styles["table-container"])}>
        <table
          ref={ref}
          role="table"
          className={classNames(
            styles["base-table"],
            { [styles["loading"]]: isLoading },
            className
          )}
          style={style}>
          <thead>
            <tr role="row">
              {finalColumns.map((column, colIndex) => (
                <th
                  role="columnheader"
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
              <tr key="loading" className={styles["loading-row"]}>
                <td colSpan={columns.length} className={styles["empty-table"]}>
                  <ClipLoader color="#94A3B8" />
                </td>
              </tr>
            ) : data?.length > 0 ? (
              <List
                height={parseInt(scrollHeight, 10) || 500}
                itemCount={data.length}
                itemSize={rowHeight}
                width="100%"
                outerElementType="tbody">
                {Row}
              </List>
            ) : (
              <tr>
                <td colSpan={columns.length} className={styles["empty-table"]}>
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

export default forwardRef(Table);
