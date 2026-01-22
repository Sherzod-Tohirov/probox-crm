import type { CSSProperties, ReactNode } from 'react';

export type Alignment = 'start' | 'center' | 'end';

export interface TableColumn<Row = any> {
  key: string;
  title?: string;
  width?:
    | string
    | { xs?: string; sm?: string; md?: string; lg?: string; xl?: string };
  minWidth?: string | number;
  maxWidth?: string | number;
  icon?: string;
  renderCell?: (row: Row, rowIndex: number) => ReactNode;
  cellStyle?: CSSProperties;
  hideOnMobile?: boolean;
  horizontal?: Alignment; // left/center/right
  vertical?: Alignment; // top/middle/bottom
}

export interface TableProps<Row = any> {
  id?: string;
  uniqueKey?: string | string[] | null;
  columns?: TableColumn<Row>[];
  data?: Row[];
  className?: string;
  style?: CSSProperties;
  containerStyle?: CSSProperties;
  containerClass?: string;
  selectionEnabled?: boolean;
  isRowSelectable?: (row: Row) => boolean;
  selectedRows?: Row[];
  onSelectionChange?: (rows: Row[]) => void;
  containerHeight?:
    | string
    | { xs?: string; sm?: string; md?: string; lg?: string; xl?: string };
  isLoading?: boolean;
  showPivotColumn?: boolean;
  rowNumberOffset?: number;
  scrollable?:
    | boolean
    | { xs?: boolean; sm?: boolean; md?: boolean; lg?: boolean; xl?: boolean };
  scrollHeight?:
    | string
    | { xs?: string; sm?: string; md?: string; lg?: string; xl?: string };
  getRowStyles?: (row: Row, rowIndex: number) => CSSProperties;
  onRowClick?: (row: Row) => void;
  hover?: boolean;
}

declare const Table: React.ForwardRefExoticComponent<
  TableProps & React.RefAttributes<HTMLTableElement>
>;
export default Table;
