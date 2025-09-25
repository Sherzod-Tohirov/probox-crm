import { useCallback, useMemo, useState } from 'react';

import formatDate from '@utils/formatDate';
import { formatToReadablePhoneNumber } from '@utils/formatPhoneNumber';
import formatterCurrency from '@utils/formatterCurrency';

import { exportTableToExcel } from '@/utils/excel';

export default function useStatisticsExcelExport({ clients, params, user }) {
  const [isExporting, setIsExporting] = useState(false);

  const clientExportColumns = useMemo(
    () => [
      { key: 'CardCode', header: 'Kod', width: 16 },
      { key: 'CardName', header: 'FIO', width: 45 },
      {
        key: 'Phone1',
        header: 'Telefon',
        formatter: (value) => formatToReadablePhoneNumber(value) || '-',
        width: 18,
      },
      { key: 'Dscription', header: 'Mahsulot', width: 45 },
      {
        key: 'InsTotal',
        header: "To'lov (USD)",
        formatter: (value) => formatterCurrency(value || 0, 'USD'),
        includeTotal: true,
        alignment: { horizontal: 'right' },
        width: 18,
      },
      {
        key: 'PaidToDate',
        header: "To'landi (USD)",
        formatter: (value) => formatterCurrency(value || 0, 'USD'),
        includeTotal: true,
        alignment: { horizontal: 'right' },
        width: 18,
      },
      {
        key: 'DueDate',
        header: 'Muddati',
        formatter: (value) => (value ? formatDate(value) : '-'),
        width: 16,
      },
      {
        key: 'NewDueDate',
        header: 'Kelishilgan sana',
        formatter: (value) => (value ? formatDate(value) : '-'),
        width: 18,
      },
      {
        key: 'SlpName',
        header: 'Ijrochi',
        alignment: { horizontal: 'left' },
        width: 20,
        valueGetter: (item) => item?.SlpName || item?.SlpCode || '-',
        defaultValue: '-',
      },
      {
        key: 'phoneConfiscated',
        header: 'Telefon berilganmi',
        valueGetter: (item) => {
          if (typeof item?.phoneConfiscated === 'boolean') {
            return item?.phoneConfiscated ? 'Ha' : "Yo'q";
          }
          return '-';
        },
        width: 20,
        cellStyle: ({ value }) => {
          if (value === 'Ha') {
            return {
              fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF16A34A' },
              },
              font: { color: { argb: 'FFFFFFFF' } },
            };
          }
          if (value === "Yo'q") {
            return {
              fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFDC2626' },
              },
              font: { color: { argb: 'FFFFFFFF' } },
            };
          }
          return undefined;
        },
      },
      {
        key: 'partial',
        header: 'Qisman qoplanganmi',
        width: 20,
        valueGetter: (item) => {
          if (typeof item?.partial === 'boolean') {
            return item?.partial ? 'Ha' : "Yo'q";
          }
          return '-';
        },
        cellStyle: ({ value }) => {
          if (value === 'Ha') {
            return {
              fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF16A34A' },
              },
              font: { color: { argb: 'FFFFFFFF' } },
            };
          }
          if (value === "Yo'q") {
            return {
              fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFDC2626' },
              },
              font: { color: { argb: 'FFFFFFFF' } },
            };
          }
          return undefined;
        },
      },
    ],
    []
  );

  const handleDownloadExcel = useCallback(async () => {
    if (!clients?.refetch) return;

    try {
      setIsExporting(true);
      const { data: refreshedData } = await clients.refetch();
      const dataset = refreshedData?.data ?? [];

      if (!dataset.length) {
        return;
      }

      const workbookName = `clients-${formatDate(
        params?.startDate,
        'YYYY.MM.DD',
        'DD-MM-YYYY'
      )}-${formatDate(params?.endDate, 'YYYY.MM.DD', 'DD-MM-YYYY')}.xlsx`;

      await exportTableToExcel({
        mainData: dataset,
        columns: clientExportColumns,
        includeRowIndex: true,
        totals: {
          include: true,
          label: 'Jami',
          sumKeys: ['InsTotal', 'PaidToDate', 'SumApplied'],
        },
        workbookName,
        sheetName: 'Clients',
        freezeHeader: true,
        metadata: {
          creator: user?.fullName || user?.username || 'Probox CRM',
          properties: {
            title: 'Klientlar hisobot',
            subject: 'Eksport qilingan mijozlar maʼlumotlari',
          },
        },
      });
    } catch (error) {
      console.error('Excel export failed', error);
    } finally {
      setIsExporting(false);
    }
  }, [
    clientExportColumns,
    clients,
    params?.endDate,
    params?.startDate,
    user?.fullName,
    user?.username,
  ]);

  return {
    handleDownloadExcel,
    isExporting,
  };
}
