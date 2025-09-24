import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const DEFAULT_HEADER_STYLE = {
  font: { bold: true, color: { argb: 'FFFFFFFF' } },
  alignment: { vertical: 'middle', horizontal: 'center' },
  fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3B82F6' } },
  border: {
    top: { style: 'thin', color: { argb: 'FFCBD5F5' } },
    bottom: { style: 'thin', color: { argb: 'FFCBD5F5' } },
    left: { style: 'thin', color: { argb: 'FFCBD5F5' } },
    right: { style: 'thin', color: { argb: 'FFCBD5F5' } },
  },
};

const DEFAULT_ROW_STYLE = {
  alignment: { vertical: 'middle' },
  border: {
    bottom: { style: 'hair', color: { argb: 'FFE2E8F0' } },
  },
};

const DEFAULT_TOTAL_STYLE = {
  font: { bold: true },
  fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } },
  border: {
    top: { style: 'thin', color: { argb: 'FFCBD5F5' } },
    bottom: { style: 'thick', color: { argb: 'FFCBD5F5' } },
  },
};

const toTitleCase = (key = '') =>
  key
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^.{1}/, (match) => match.toUpperCase());

const applyStyle = (target, style) => {
  if (!style) return;
  if (typeof style === 'function') {
    style(target);
    return;
  }

  const { font, alignment, border, fill, numFmt } = style;
  if (font) target.font = { ...target.font, ...font };
  if (alignment) target.alignment = { ...target.alignment, ...alignment };
  if (border) target.border = { ...target.border, ...border };
  if (fill) target.fill = fill;
  if (numFmt) target.numFmt = numFmt;
};

const normalizeColumns = (
  data,
  {
    columns,
    includeFields,
    excludeFields,
    includeRowIndex,
    columnWidths,
    formatters,
  }
) => {
  const sampleRow = data[0] ?? {};

  let resolvedColumns = [];

  if (Array.isArray(columns) && columns.length > 0) {
    resolvedColumns = columns.map((col) =>
      typeof col === 'string'
        ? {
            key: col,
            header: toTitleCase(col),
          }
        : {
            header: col.header ?? toTitleCase(col.key),
            key: col.key,
            formatter: col.formatter,
            width: col.width,
            includeTotal: Boolean(col.includeTotal),
            style: col.style,
            headerStyle: col.headerStyle,
            totalStyle: col.totalStyle,
            valueGetter: col.valueGetter,
            alignment: col.alignment,
            defaultValue: col.defaultValue,
          }
    );
  } else {
    const baseKeys = includeFields?.length
      ? includeFields
      : Object.keys(sampleRow);
    resolvedColumns = baseKeys
      .filter((key) => !(excludeFields ?? []).includes(key))
      .map((key) => ({
        key,
        header: toTitleCase(key),
      }));
  }

  if (includeRowIndex) {
    resolvedColumns = [
      {
        key: '__rowIndex',
        header: '#',
        width: 6,
        alignment: { horizontal: 'center' },
        valueGetter: (_, index) => index + 1,
        includeTotal: false,
      },
      ...resolvedColumns,
    ];
  }

  return resolvedColumns.map((col) => ({
    ...col,
    width: col.width ?? columnWidths?.[col.key],
    formatter: col.formatter ?? formatters?.[col.key],
  }));
};

const buildTotals = (data, columns, totalsConfig = {}) => {
  const {
    include = false,
    label = 'Total',
    labelKey,
    sumKeys,
    formatter,
    customValues = {},
  } = totalsConfig;

  const totalKeys = new Set();

  if (Array.isArray(sumKeys) && sumKeys.length > 0) {
    sumKeys.forEach((key) => totalKeys.add(key));
  }

  columns.forEach((column) => {
    if (column.includeTotal) {
      totalKeys.add(column.key);
    }
  });

  if (
    !include &&
    totalKeys.size === 0 &&
    Object.keys(customValues).length === 0
  ) {
    return null;
  }

  const totals = {};

  totalKeys.forEach((key) => {
    const sum = data.reduce((acc, item) => {
      const value = item?.[key];
      if (value === null || value === undefined || value === '') return acc;
      const numericValue = Number(value);
      return Number.isFinite(numericValue) ? acc + numericValue : acc;
    }, 0);
    totals[key] = sum;
  });

  Object.entries(customValues).forEach(([key, value]) => {
    totals[key] = value;
  });

  const primaryKey =
    labelKey ?? columns.find((column) => column.key !== '__rowIndex')?.key;

  if (primaryKey) {
    totals[primaryKey] = label;
  } else if (columns[0]) {
    totals[columns[0].key] = label;
  }

  if (typeof formatter === 'function') {
    columns.forEach((column) => {
      const value = totals[column.key];
      totals[column.key] = formatter({ key: column.key, value, totals, data });
    });
  }

  return totals;
};

export async function exportTableToExcel({
  mainData = [],
  workbookName = `export-${new Date().toISOString().slice(0, 10)}.xlsx`,
  sheetName = 'Sheet1',
  columns,
  includeFields,
  excludeFields,
  includeRowIndex = false,
  columnWidths,
  formatters = {},
  headerStyle,
  rowStyle,
  totalStyle,
  totals,
  metadata = {},
  freezeHeader = true,
  autoFilter = true,
  beforeDownload,
} = {}) {
  if (!Array.isArray(mainData) || mainData.length === 0) {
    throw new Error(
      'exportTableToExcel: `mainData` must be a non-empty array.'
    );
  }

  const normalizedColumns = normalizeColumns(mainData, {
    columns,
    includeFields,
    excludeFields,
    includeRowIndex,
    columnWidths,
    formatters,
  });

  const workbook = new ExcelJS.Workbook();
  workbook.created = new Date();
  workbook.modified = new Date();

  if (metadata.creator) workbook.creator = metadata.creator;
  if (metadata.lastModifiedBy)
    workbook.lastModifiedBy = metadata.lastModifiedBy;
  if (metadata.properties) {
    workbook.properties = { ...workbook.properties, ...metadata.properties };
  }

  const worksheet = workbook.addWorksheet(sheetName, {
    views: freezeHeader ? [{ state: 'frozen', ySplit: 1 }] : undefined,
  });

  worksheet.columns = normalizedColumns.map((column) => ({
    header: column.header,
    key: column.key,
    width: column.width,
    style: column.style,
  }));

  const headerRow = worksheet.getRow(1);
  headerRow.height = 24;
  headerRow.eachCell((cell, columnNumber) => {
    const column = normalizedColumns[columnNumber - 1];
    applyStyle(cell, DEFAULT_HEADER_STYLE);
    applyStyle(cell, headerStyle);
    applyStyle(cell, column?.headerStyle);
  });

  mainData.forEach((item, index) => {
    const rowValues = {};

    normalizedColumns.forEach((column) => {
      const valueGetter = column.valueGetter;
      const rawValue =
        typeof valueGetter === 'function'
          ? valueGetter(item, index)
          : item?.[column.key];
      const formatter = column.formatter;
      const formatted = formatter ? formatter(rawValue, item, index) : rawValue;
      rowValues[column.key] = formatted ?? column.defaultValue ?? null;
    });

    const addedRow = worksheet.addRow(rowValues);
    applyStyle(addedRow, DEFAULT_ROW_STYLE);
    applyStyle(addedRow, rowStyle);

    normalizedColumns.forEach((column, columnIndex) => {
      const cell = addedRow.getCell(columnIndex + 1);
      if (column.alignment) {
        cell.alignment = { ...cell.alignment, ...column.alignment };
      }
    });
  });

  const totalsRowValues = buildTotals(mainData, normalizedColumns, totals);
  if (totalsRowValues) {
    const totalsRow = worksheet.addRow(totalsRowValues);
    applyStyle(totalsRow, DEFAULT_TOTAL_STYLE);
    applyStyle(totalsRow, totalStyle);

    normalizedColumns.forEach((column, columnIndex) => {
      const cell = totalsRow.getCell(columnIndex + 1);
      applyStyle(cell, column.totalStyle);
    });
  }

  if (autoFilter) {
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: normalizedColumns.length },
    };
  }

  if (typeof beforeDownload === 'function') {
    await beforeDownload({ workbook, worksheet, columns: normalizedColumns });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  saveAs(blob, workbookName);
  return blob;
}
