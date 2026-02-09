import moment from 'moment';
import { useMemo } from 'react';

export default function useDateColumns() {
  const daysInMonth = moment().daysInMonth();
  const monthDaysColumns = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = moment().clone().startOf('month').add(i, 'day');
      const formattedDate = date.format('DD.MM.YYYY');
      return {
        key: formattedDate,
        title: formattedDate,
        width: '12%',
        minWidth: '40px',
        icon: 'calendarFilled',
      };
    });
  }, [daysInMonth]);
  return { monthDaysColumns };
}
