import formatDate from '@/utils/formatDate';
import { useMemo } from 'react';
import useFetchExecutors from '@/hooks/data/useFetchExecutors';
import iconsMap from '@utils/iconsMap';

export default function useLeadsTableColumns() {
  const { data: operator1List = [], isLoading: isOperator1Loading } =
    useFetchExecutors({
      include_role: 'Operator1',
    });
  const { data: operator2List = [], isLoading: isOperator2Loading } =
    useFetchExecutors({
      include_role: 'Operator2',
    });
  console.log(operator1List, 'operator1List');
  console.log(operator2List, 'operator2List');
  const findOperatorName = (operatorCode, type = 'operator1') => {
    const operator = (
      type === 'operator1' ? operator1List : operator2List
    ).find((operator) => String(operator.SlpCode) === String(operatorCode));

    return operator?.SlpName || '-';
  };

  const getSourceStyle = (source) => {
    const sourceStyles = {
      'Manychat': {
        icon: 'chatBubble',
        bgColor: '#00D4AA',
        textColor: '#fff',
        name: 'Manychat'
      },
      'Meta': {
        icon: 'facebook',
        bgColor: '#1877F2',
        textColor: '#fff',
        name: 'Meta'
      },
      'Organika': {
        icon: 'leaf',
        bgColor: '#22C55E',
        textColor: '#fff',
        name: 'Organika'
      },
      'Kiruvchi qongiroq': {
        icon: 'telephone',
        bgColor: '#F59E0B',
        textColor: '#fff',
        name: 'Qo\'ng\'iroq'
      },
      'Community': {
        icon: 'users',
        bgColor: '#8B5CF6',
        textColor: '#fff',
        name: 'Community'
      }
    };
    
    return sourceStyles[source] || {
      icon: 'globe',
      bgColor: '#6B7280',
      textColor: '#fff',
      name: source || 'Noma\'lum'
    };
  };

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
        renderCell: (column) => {
          const { source } = column;
          const sourceStyle = getSourceStyle(source);
          
          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                borderRadius: '8px',
                backgroundColor: sourceStyle.bgColor,
                color: sourceStyle.textColor,
                fontSize: '12px',
                fontWeight: '500',
                width: '100px',
                height: '28px',
                justifyContent: 'center',
                boxSizing: 'border-box',
              }}
            >
              <span style={{ 
                fontSize: '14px', 
                display: 'flex', 
                alignItems: 'center',
                width: '14px',
                height: '14px',
                justifyContent: 'center'
              }}>
                {iconsMap[sourceStyle.icon]}
              </span>
              <span style={{ 
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                flex: 1
              }}>
                {sourceStyle.name}
              </span>
            </div>
          );
        },
      },

      {
        key: 'operator',
        title: 'Operator 1',
        width: { xs: '20%', md: '12%', xl: '10%' },
        renderCell: (column) => {
          const { operator } = column;
          console.log(findOperatorName(operator), 'found');
          return <span>{findOperatorName(operator)}</span>;
        },
      },
      {
        key: 'operator2',
        title: 'Operator 2',
        width: { xs: '20%', md: '12%', xl: '10%' },
        renderCell: (column) => {
          const { operator2 } = column;
          return <span>{findOperatorName(operator2, 'operator2')}</span>;
        },
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
        key: 'meetingDate',
        title: 'Uchrashuv sanasi',
        renderCell: (column) => {
          const { meetingDate } = column;
          return (
            <span>{formatDate(meetingDate, 'YYYY.MM.DD', 'DD.MM.YYYY')}</span>
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
              {formatDate(time, 'YYYY.MM.DD hh:mm', 'DD.MM.YYYY HH:mm')}
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
