import { ClipLoader } from 'react-spinners';
import {
  useCallback,
  useMemo,
  useRef,
  forwardRef,
  memo,
  useState,
  useEffect,
} from 'react';
import iconsMap from '@utils/iconsMap';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import { breakpoints, getBreakpointValue } from '@config/breakpoints';
import styles from './table.module.scss';
import PropTypes from 'prop-types';
import useIsMobile from '@hooks/useIsMobile';
// Utility to check if a prop is an object for responsive values
const isResponsiveProp = (prop) => typeof prop === 'object' && prop !== null;

/**
 * @typedef {'start'|'center'|'end'} Alignment
 *
 * @typedef {Object} TableColumn
 * @property {string} key
 * @property {string} [title]
 * @property {Object|string} [width]
 * @property {string|number} [minWidth]
 * @property {string|number} [maxWidth]
 * @property {string} [icon]
 * @property {(row: any, rowIndex: number) => any} [renderCell]
 * @property {Record<string, any>} [cellStyle]
 * @property {boolean} [hideOnMobile]
 * @property {Alignment} [horizontal] Horizontal alignment: start | center | end
 * @property {Alignment} [vertical] Vertical alignment: start | center | end
 */

// Memoized table cell component
const TableCell = memo(({ column, row, rowIndex }) => {
  const content = column.renderCell
    ? column.renderCell(row, rowIndex)
    : row[column.key];

  const hMap = { start: 'left', center: 'center', end: 'right' };
  const vMap = { start: 'top', center: 'middle', end: 'bottom' };
  const alignStyle = {
    ...(column?.horizontal
      ? { textAlign: hMap[column.horizontal] || column.horizontal }
      : {}),
    ...(column?.vertical
      ? { verticalAlign: vMap[column.vertical] || column.vertical }
      : {}),
  };

  const widthStyle = {
    width: isResponsiveProp(column.width)
      ? column.width.xl || column.width.md || 'auto'
      : column.width || 'auto',
    minWidth: column.minWidth || 'initial',
    maxWidth: column.maxWidth || 'initial',
  };

  return (
    <td style={{ ...widthStyle, ...alignStyle, ...(column?.cellStyle || {}) }}>
      {content || '-'}
    </td>
  );
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
    hover,
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
        data-row-key={uniqueKeyValue}
        className={classNames({
          [styles['selected-row']]: !!getRowStyles(row, rowIndex),
          [styles['hoverable']]: hover,
        })}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        style={{
          backgroundColor: selected ? '#f0f0f0' : 'transparent',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
          ...getRowStyles(row, rowIndex),
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

const defaultScrollHeight = {
  xs: `calc(100vh - ${breakpoints.xs + 100}px)`,
  sm: `calc(100vh - ${breakpoints.sm / 4}px)`,
  md: `calc(100vh - 350px)`,
  lg: `calc(100vh - 220px)`,
  xl: `calc(100vh - 300px)`,
};

const MIN_AUTO_SCROLL_HEIGHT = 200;
const AUTO_SCROLL_BOTTOM_GAP = 16;

const Table = forwardRef(function Table(
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
    containerHeight = {
      xs: '300px',
      sm: '400px',
      md: '500px',
      lg: '600px',
      xl: 'auto',
    },
    isLoading = false,
    showPivotColumn = false,
    rowNumberOffset = 0,
    scrollable = {
      xs: true,
      sm: true,
      md: true,
      lg: false,
      xl: false,
    },
    scrollHeight = defaultScrollHeight,
    getRowStyles = () => ({}),
    onRowClick = () => {},
    hover = true,
  },
  ref
) {
  const containerRef = useRef(null);
  const pressTimeRef = useRef(0);
  const allowRowClickRef = useRef(true);
  const [autoScrollHeight, setAutoScrollHeight] = useState('auto');
  const shouldUseAutoHeight = scrollHeight === defaultScrollHeight;
  const computeAutoHeight = useCallback(() => {
    if (typeof window === 'undefined') return;
    const element = containerRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const styles = window.getComputedStyle(element);
    const marginBottom = parseFloat(styles.marginBottom || '0');
    const paddingBottom = parseFloat(styles.paddingBottom || '0');
    const borderBottom = parseFloat(styles.borderBottomWidth || '0');
    const offset = rect.top + marginBottom + paddingBottom + borderBottom;

    let footerHeight = 0;
    if (typeof document !== 'undefined') {
      const footerRoot = document.getElementById('footer-root');
      const footerNode = footerRoot?.firstElementChild;
      if (footerNode) {
        const footerRect = footerNode.getBoundingClientRect();
        const footerStyles = window.getComputedStyle(footerNode);
        const footerMarginTop = parseFloat(footerStyles.marginTop || '0');
        const footerMarginBottom = parseFloat(footerStyles.marginBottom || '0');
        footerHeight = footerRect.height + footerMarginTop + footerMarginBottom;
      }
    }

    const available =
      window.innerHeight - footerHeight - offset - AUTO_SCROLL_BOTTOM_GAP;
    const normalized = Math.max(available, MIN_AUTO_SCROLL_HEIGHT);
    setAutoScrollHeight(`${Math.round(normalized)}px`);
  }, []);

  useEffect(() => {
    if (!shouldUseAutoHeight) return;
    computeAutoHeight();
  }, [computeAutoHeight, shouldUseAutoHeight, data, columns, isLoading]);

  useEffect(() => {
    if (!shouldUseAutoHeight) return;

    const handleResize = () => {
      computeAutoHeight();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
    }

    const observers = [];
    if (typeof ResizeObserver !== 'undefined') {
      const footerRoot =
        typeof document !== 'undefined'
          ? document.getElementById('footer-root')
          : null;
      const targetElements = [
        containerRef.current,
        containerRef.current?.parentElement,
        footerRoot,
        document?.body || null,
      ].filter(Boolean);

      targetElements.forEach((target) => {
        const observer = new ResizeObserver(handleResize);
        observer.observe(target);
        observers.push(observer);
      });
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
      observers.forEach((observer) => observer.disconnect());
    };
  }, [computeAutoHeight, shouldUseAutoHeight]);

  const isMobile = useIsMobile();
  // Responsive column filtering
  const finalColumns = useMemo(() => {
    const filteredColumns = columns.filter((col) => !col.hideOnMobile);
    if (!showPivotColumn) return filteredColumns;
    return [
      {
        key: 'pivotId',
        icon: 'barCodeFilled',
        title: 'ID',
        width: { xs: '10%', md: '2%', xl: '2%' }, // Added xl breakpoint
        cellStyle: { textAlign: 'center' },
        renderCell: (_, rowIndex) =>
          rowIndex + 1 + (Number(rowNumberOffset) || 0),
      },
      ...filteredColumns,
    ];
  }, [columns, showPivotColumn, rowNumberOffset]);

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
  const rows = useMemo(() => (Array.isArray(data) ? data : []), [data]);
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
    const selectableRowsLength = rows.filter(isRowSelectable).length;
    if (!selectableRowsLength) return false;
    return selectedRows.length === selectableRowsLength;
  }, [rows, isRowSelected]);

  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      const filteredRows = rows.filter((row) => isRowSelectable(row));
      onSelectionChange([...filteredRows]);
    }
  }, [allSelected, rows, onSelectionChange]);

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

  // Resolve responsive containerHeight and scrollHeight (independent of column count)
  const resolvedContainerStyle = useMemo(() => {
    const isScrollable = getBreakpointValue(scrollable);
    const heightVal = getBreakpointValue(containerHeight);
    const scrollVal = shouldUseAutoHeight
      ? autoScrollHeight
      : getBreakpointValue(scrollHeight);
    return {
      height: isScrollable ? scrollVal : heightVal,
      ...containerStyle,
    };
  }, [
    autoScrollHeight,
    containerHeight,
    scrollHeight,
    scrollable,
    containerStyle,
    shouldUseAutoHeight,
  ]);

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
      ref={containerRef}
      style={resolvedContainerStyle}
      className={classNames(containerClassName, {
        [styles[`breakpoint-${getBreakpointValue(scrollable)}`]]: true,
      })}
    >
      <div className={styles['table-container']}>
        <table id={id} ref={ref} className={tableClassName} style={style}>
          <thead>
            <tr>
              {selectionEnabled && (
                <SelectionHeaderCell
                  disabled={rows.filter(isRowSelectable).length === 0}
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
              )}
              {finalColumns.map((column, colIndex) => (
                <th
                  key={`header-${column.key}-${colIndex}`}
                  style={{
                    width: isResponsiveProp(column.width)
                      ? column.width.xl || column.width.md || 'auto'
                      : column.width || 'auto',
                    minWidth: column.minWidth || 'initial',
                    maxWidth: column.maxWidth || 'initial',
                    textAlign:
                      column?.horizontal === 'start'
                        ? 'left'
                        : column?.horizontal === 'end'
                          ? 'right'
                          : column?.horizontal === 'center'
                            ? 'center'
                            : undefined,
                    verticalAlign:
                      column?.vertical === 'start'
                        ? 'top'
                        : column?.vertical === 'end'
                          ? 'bottom'
                          : column?.vertical === 'center'
                            ? 'middle'
                            : undefined,
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
                  <ClipLoader color="#94A3B8" size={26} />
                </td>
              </tr>
            ) : rows.length > 0 ? (
              rows.map((row, rowIndex) => (
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
                  hover={hover}
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
});

// Update prop types for better documentation
Table.propTypes = {
  containerHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  scrollable: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  scrollHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  rowNumberOffset: PropTypes.number,
  // ...other prop types...
};

export default memo(Table);
