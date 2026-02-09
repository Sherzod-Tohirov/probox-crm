import { Typography } from '@/components/ui';
import { formatterNumber } from '@/utils/formatterNumber';
import { useMemo } from 'react';
import useDateColumns from './useDateColumns';

export default function useLeadsBySourceTableColumns() {
  const { monthDaysColumns } = useDateColumns();
  const fixedColumns = useMemo(
    () => [
      {
        key: 'source',
        title: 'Manba',
        width: '200px',
        minWidth: '40px',
        icon: 'userFilled',
        renderCell: (column) => column.source,
      },
      {
        key: 'leads',
        title: 'Leadlar',
        width: '200px',
        minWidth: '40px',
        icon: 'userFilled',
        renderCell: (column) => (
          <Typography variant="subtitle2" color="success">
            {formatterNumber(column.leads)}
          </Typography>
        ),
      },
      {
        key: 'cr',
        title: 'CR%',
        width: '200px',
        minWidth: '40px',
        icon: 'userFilled',
        renderCell: (column) => column.cr,
      },
    ],
    []
  );

  const leadsBySourceTableColumns = [...fixedColumns, ...monthDaysColumns];
  return { leadsBySourceTableColumns };
}
