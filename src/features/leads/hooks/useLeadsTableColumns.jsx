import formatDate from '@/utils/formatDate';
import { useMemo } from 'react';

export default function useLeadsTableColumns() {
  const leadsTableColumns = useMemo(
    () => [
      {
        key: 'clientName',
        title: 'Ismi',
        width: { xs: '40%', md: '24%', xl: '20%' },
        minWidth: '120px',
      },
      {
        key: 'clientPhone',
        title: 'Telefon',
        width: { xs: '30%', md: '18%', xl: '14%' },
        minWidth: '120px',
      },
      {
        key: 'source',
        title: 'Manba',
        width: { xs: '20%', md: '12%', xl: '10%' },
        minWidth: '120px',
      },

      {
        key: 'operator',
        title: 'Operator 1',
        width: { xs: '20%', md: '12%', xl: '10%' },
      },
      {
        key: 'operator2',
        title: 'Operator 2',
        width: { xs: '20%', md: '12%', xl: '10%' },
      },
      {
        key: 'meetingConfirmed',
        title: 'Uchrashuv belgilandimi',
        renderCell: (column) => {
          const { meetingConfirmed } = column;
          return (
            <span style={{ color: meetingConfirmed ? 'green' : 'red' }}>
              {meetingConfirmed ? 'Ha' : "Yo'q"}
            </span>
          );
        },
      },
      {
        key: 'time',
        title: 'Vaqti',
        width: { xs: '30%', md: '14%', xl: '12%' },
        renderCell: (column) => {
          const { time } = column;
          return (
            <span>
              {time ? formatDate(
                time,
                'YYYY-MM-DD HH:mm:ss.SSSSSSSSS',
                'DD.MM.YYYY HH:mm'
              ) : "-"}
            </span>
          );
        },
      },
      {
        key: 'comment',
        title: 'Izoh',
        width: { xs: '40%', md: '22%', xl: '20%' },
      },
    ],
    []
  );

  return { leadsTableColumns };
}
