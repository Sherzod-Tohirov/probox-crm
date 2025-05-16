// VirtualizedTable.tsx updated to work with @tanstack/react-table v8 column definitions

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import classNames from "classnames";
import styles from "./virtualizedTable.module.scss";
import { ClipLoader } from "react-spinners";

function VirtualizedTable({
  columns = [],
  data = [],
  className,
  containerClass,
  isLoading = false,
  height = 600,
  rowHeight = 50,
  onRowClick = () => {},
}) {
  const parentRef = useRef();

  const table = useReactTable({
    columns: columns.map((col) => ({
      id: col.key || col.id || col.accessorKey, // ensure ID exists
      accessorKey: col.key,
      header: col.title,
      cell: col.renderCell
        ? ({ row }) => col.renderCell(row.original)
        : undefined,
      size: col.width ? parseInt(col.width) : undefined,
    })),
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 10,
  });

  return (
    <div className={classNames(styles["table-container"], containerClass)}>
      <table className={classNames(styles["base-table"], className)}>
        <thead className={styles["table-header"]}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className={styles["table-row"]}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className={styles["table-header-cell"]}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
      </table>

      <div ref={parentRef} style={{ height: `${height}px`, overflow: "auto" }}>
        <table className={classNames(styles["base-table"], className)}>
          <tbody style={{ height: rowVirtualizer.getTotalSize() }}>
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = table.getRowModel().rows[virtualRow.index];
              return (
                <tr
                  key={row.id}
                  className={styles["table-row"]}
                  style={{ transform: `translateY(${virtualRow.start}px)` }}
                  onClick={() => onRowClick(row.original)}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={styles["table-cell"]}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        {isLoading && (
          <div className={styles["table-loading-row"]}>
            <ClipLoader color="#94A3B8" />
          </div>
        )}
        {!isLoading && data.length === 0 && (
          <div className={styles["table-cell"]} style={{ textAlign: "center" }}>
            Ma'lumot mavjud emas.
          </div>
        )}
      </div>
    </div>
  );
}

export default VirtualizedTable;
