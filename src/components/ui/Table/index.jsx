import { ClipLoader } from 'react-spinners';
import { useCallback, useMemo, useRef, forwardRef, memo } from 'react';
import iconsMap from '@utils/iconsMap';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import styles from './table.module.scss';
// import { breakpoints } from '../config/breakpoints'; // Import breakpoints

// Utility to check if a prop is an object for responsive values
const isResponsiveProp = (prop) => typeof prop === 'object' && prop !== null;

// Memoized table cell component
const TableCell = memo(({ column, row, rowIndex }) => {
  const content = column.renderCell
    ? column.renderCell(row, rowIndex)
    : row[column.key];

  return <td style={column?.cellStyle || {}}>{content}</td>;
});

// Selection checkbox cell
const SelectionCell = memo(({ checked, onChange, ...props }) => (
  <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
    <label
      className={classNames(styles['selection-checkbox'], {
        [styles['disabled']]: props.disabled,
      })}
    >
      <input
        {...props}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        onClick={(e) => e.stopPropagation()}
      />
    </label>
  </td>
));

// Selection header cell
const SelectionHeaderCell = memo(({ checked, onChange, ...props }) => (
  <th style={{ textAlign: 'center', width: '40px' }}>
    <label
      className={classNames(styles['selection-checkbox'], {
        [styles['disabled']]: props.disabled,
      })}
    >
      <input
        {...props}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        onClick={(e) => e.stopPropagation()}
      />
    </label>
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
    isRowSelectable,
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
        return uniqueKey.map((key) => row[key]).join('-');
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
        style={{
          ...getRowStyles(row, rowIndex),
          cursor: 'pointer',
          backgroundColor: selected ? '#f0f0f0' : 'transparent',
          transition: 'background-color 0.2s ease',
        }}
      >
        {selectionEnabled && (
          <SelectionCell
            checked={selected}
            onChange={() => onSelectRow(row)}
            disabled={!isRowSelectable(row)}
          />
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
    id,
    uniqueKey = null,
    columns = [],
    data = [],
    className,
    style = {},
    containerStyle = {},
    containerClass,
    selectionEnabled = false,
    isRowSelectable = () => true,
    selectedRows = [],
    onSelectionChange = () => {},
    containerHeight = null, // Can be scalar or { xs: '200px', md: 'auto' }
    isLoading = false,
    showPivotColumn = false,
    scrollable = false, // Can be scalar or { xs: true, md: false }
    scrollHeight = {
      xs: 'calc(100vh - 200px)',
      md: columns.length > 10 ? 'calc(100vh - 450px)' : 'auto',
    }, // Responsive
    getRowStyles = () => ({}),
    onRowClick = () => {},
  },
  ref
) {
  const pressTimeRef = useRef(0);
  const allowRowClickRef = useRef(true);

  // Responsive column filtering
  const finalColumns = useMemo(() => {
    const filteredColumns = columns.filter((col) => !col.hideOnMobile);
    if (!showPivotColumn) return filteredColumns;
    return [
      {
        key: 'pivotId',
        icon: 'barCodeFilled',
        title: 'ID',
        width: { xs: '10%', md: '2%' }, // Responsive width
        cellStyle: { textAlign: 'center' },
        renderCell: (_, rowIndex) => rowIndex + 1,
      },
      ...filteredColumns,
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
        return uniqueKey.map((key) => row[key]).join('-');
      }
      return uniqueKey ? row[uniqueKey] : uuidv4();
    },
    [uniqueKey]
  );

  const isRowSelected = useCallback(
    (row) => {
      const key = Array.isArray(uniqueKey)
        ? uniqueKey.map((k) => row[k]).join('-')
        : uniqueKey
          ? row[uniqueKey]
          : null;
      return selectedRows.some(
        (selected) =>
          (Array.isArray(uniqueKey)
            ? uniqueKey.map((k) => selected[k]).join('-')
            : uniqueKey
              ? selected[uniqueKey]
              : null) === key
      );
    },
    [selectedRows, uniqueKey]
  );

  const allSelected = useMemo(() => {
    const selectableRowsLength = data.filter(isRowSelectable).length;
    if (!selectableRowsLength) return false;
    return selectedRows.length === selectableRowsLength;
  }, [data, isRowSelected]);

  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      const filteredRows = data.filter((row) => isRowSelectable(row));
      onSelectionChange([...filteredRows]);
    }
  }, [allSelected, data, onSelectionChange]);

  const handleSelectRow = useCallback(
    (row) => {
      if (isRowSelected(row)) {
        onSelectionChange(
          selectedRows.filter(
            (selected) =>
              (Array.isArray(uniqueKey)
                ? uniqueKey.map((k) => selected[k]).join('-')
                : uniqueKey
                  ? selected[uniqueKey]
                  : null) !==
              (Array.isArray(uniqueKey)
                ? uniqueKey.map((k) => row[k]).join('-')
                : uniqueKey
                  ? row[uniqueKey]
                  : null)
          )
        );
      } else {
        onSelectionChange([...selectedRows, row]);
      }
    },
    [selectedRows, onSelectionChange, uniqueKey, isRowSelected]
  );

  const containerClassName = useMemo(
    () =>
      classNames(
        styles['table-wrapper'],
        {
          [styles['scrollable']]: isResponsiveProp(scrollable)
            ? scrollable.md
            : scrollable,
          [styles['loading']]: isLoading,
        },
        containerClass
      ),
    [scrollable, isLoading, containerClass]
  );

  // Resolve responsive containerHeight and scrollHeight
  const resolvedContainerStyle = useMemo(() => {
    const height = isResponsiveProp(containerHeight)
      ? containerHeight.md || 'auto'
      : containerHeight || 'auto';
    const scroll = isResponsiveProp(scrollHeight)
      ? scrollHeight.md || 'auto'
      : scrollHeight;
    return {
      height: scrollable ? scroll : height,
      ...containerStyle,
    };
  }, [containerHeight, scrollHeight, scrollable, containerStyle]);

  const tableClassName = useMemo(
    () =>
      classNames(
        styles['base-table'],
        { [styles['loading']]: isLoading },
        className
      ),
    [isLoading, className]
  );

  return (
    <div
      id="table-wrapper"
      data-testid="table-wrapper"
      style={resolvedContainerStyle}
      className={containerClassName}
    >
      <div className={styles['table-container']}>
        <table id={id} ref={ref} className={tableClassName} style={style}>
          <thead>
            <tr>
              {selectionEnabled && (
                <SelectionHeaderCell
                  disabled={data.filter(isRowSelectable).length === 0}
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
              )}
              {finalColumns.map((column, colIndex) => (
                <th
                  key={`header-${column.key}-${colIndex}`}
                  style={{
                    width: isResponsiveProp(column.width)
                      ? column.width.md || 'auto'
                      : column.width || 'auto',
                    minWidth: column.minWidth || 'initial',
                    maxWidth: column.maxWidth || 'initial',
                  }}
                >
                  <div className={styles['table-header-cell']}>
                    {column.icon && iconsMap[column.icon]} {column.title}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className={styles['loading-row']}>
                <td
                  colSpan={finalColumns.length + (selectionEnabled ? 1 : 0)}
                  className={styles['empty-table']}
                >
                  <ClipLoader color={'#94A3B8'} size={26} />
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
                  isRowSelectable={isRowSelectable}
                  onRowClick={memoizedRowClick}
                  getRowStyles={getRowStyles}
                  handleMouseDown={handleMouseDown}
                  handleMouseUp={handleMouseUp}
                  selectionEnabled={selectionEnabled}
                  selected={isRowSelected(row)}
                  onSelectRow={handleSelectRow}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={finalColumns.length + (selectionEnabled ? 1 : 0)}
                  className={styles['empty-table']}
                >
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
