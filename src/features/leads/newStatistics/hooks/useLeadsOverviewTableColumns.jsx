import { Badge } from '@/components/ui';
import formatterCurrency from '@/utils/formatterCurrency';
import { useMemo } from 'react';

export default function useLeadsOverviewTableColumns() {
  const getBadgeColor = (value) => {
    if (value < 20) return 'danger';
    if (value < 40) return 'warning';
    if (value < 60) return 'info';
    return 'success';
  };
  const leadsOverviewTableColumns = useMemo(
    () => [
      {
        key: 'levels',
        title: 'Bosqichlar',
        width: '200px',
        minWidth: '40px',
        icon: 'barCodeFilled',
      },
      {
        key: 'leads',
        title: 'Leadlar',
        width: '200px',
        minWidth: '40px',
        icon: 'userFilled',
        renderCell: (column) => formatterCurrency(column.leads),
      },
      {
        key: 'cr',
        title: 'CR%',
        width: '12%',
        minWidth: '40px',
        icon: 'presentationFilled',
        renderCell: (column) => (
          <Badge style={{ minWidth: '60px' }} color={getBadgeColor(column.cr)}>
            {column.cr + '%'}
          </Badge>
        ),
      },
    ],
    []
  );
  return { leadsOverviewTableColumns };
}
