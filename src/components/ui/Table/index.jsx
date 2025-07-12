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

// Selection checkbox cell
const SelectionCell = memo(({ checked, onChange }) => (
  <td style={{ textAlign: "center" }}>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      onClick={(e) => e.stopPropagation()}
    />
  </td>
));

// Selection header cell
const SelectionHeaderCell = memo(({ checked, onChange }) => (
  <th style={{ textAlign: "center", width: "40px" }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
  </th>
));

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
    selectionEnabled,
    selected,
    onSelectRow,
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
        {selectionEnabled && (
          <SelectionCell checked={selected} onChange={() => onSelectRow(row)} />
        )}
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
    selectionEnabled = true,
    selectedRowKeys = [],
    onSelectionChange = () => {},
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

  // Selection logic
  const getRowKey = useCallback(
    (row) => {
      if (Array.isArray(uniqueKey)) {
        return uniqueKey.map((key) => row[key]).join("-");
      }
      return uniqueKey ? row[uniqueKey] : uuidv4();
    },
    [uniqueKey]
  );

  const allSelected = useMemo(() => {
    if (!data?.length) return false;
    return data.every((row) => selectedRowKeys.includes(getRowKey(row)));
  }, [data, selectedRowKeys, getRowKey]);

  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      const allKeys = data.map(getRowKey);
      onSelectionChange(allKeys);
    }
  }, [allSelected, data, getRowKey, onSelectionChange]);

  const handleSelectRow = useCallback(
    (row) => {
      const key = getRowKey(row);
      let newSelected;
      if (selectedRowKeys.includes(key)) {
        newSelected = selectedRowKeys.filter((k) => k !== key);
      } else {
        newSelected = [...selectedRowKeys, key];
      }
      onSelectionChange(newSelected);
    },
    [selectedRowKeys, onSelectionChange, getRowKey]
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
              {selectionEnabled && (
                <SelectionHeaderCell
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
              )}
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
                  colSpan={finalColumns.length + (selectionEnabled ? 1 : 0)}
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
                  selectionEnabled={selectionEnabled}
                  selected={selectedRowKeys.includes(getRowKey(row))}
                  onSelectRow={handleSelectRow}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={finalColumns.length + (selectionEnabled ? 1 : 0)}
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
