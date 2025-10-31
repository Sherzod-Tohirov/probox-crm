import formatDate from '@/utils/formatDate';
import { useMemo, useCallback, cloneElement } from 'react';
import useFetchExecutors from '@/hooks/data/useFetchExecutors';
import useFetchBranches from '@/hooks/data/useFetchBranches';
import iconsMap from '@utils/iconsMap';
import { Badge } from '@/components/ui';
import { formatToReadablePhoneNumber } from '@/utils/formatPhoneNumber';
import { formatterPayment } from '@/utils/formatterPayment';

/**
 * @typedef {import('../../../components/ui/Table').TableColumn} TableColumn
 */

export default function useLeadsTableColumns() {
  const { data: operator1List = [] } = useFetchExecutors({
    include_role: 'Operator1',
  });
  const { data: operator2List = [] } = useFetchExecutors({
    include_role: 'Operator2',
  });
  const { data: branchList = [] } = useFetchBranches();
  const findOperatorName = useCallback(
    (operatorCode, type = 'operator1') => {
      const operator = (
        type === 'operator1' ? operator1List : operator2List
      ).find((operator) => String(operator.SlpCode) === String(operatorCode));
      return operator?.SlpName || '-';
    },
    [operator1List, operator2List]
  );

  const findBranchName = useCallback(
    (branchCode) => {
      const branch = branchList.find(
        (branch) => String(branch.id) === String(branchCode)
      );

      return branch?.name || '-';
    },
    [branchList]
  );

  const getSourceStyle = (source) => {
    const sourceStyles = {
      Manychat: {
        icon: 'chatBubble',
        bgColor: '#00D4AA',
        textColor: '#fff',
        name: 'Manychat',
      },
      Meta: {
        icon: 'meta',
        bgColor: '#1877F2',
        textColor: '#fff',
        name: 'Meta',
      },
      Organika: {
        icon: 'leaf',
        bgColor: '#22C55E',
        textColor: '#fff',
        name: 'Organika',
      },
      'Kiruvchi qongiroq': {
        icon: 'telephone',
        bgColor: '#F59E0B',
        textColor: '#fff',
        name: "Qo'ng'iroq",
      },
      Community: {
        icon: 'users',
        bgColor: '#8B5CF6',
        textColor: '#fff',
        name: 'Community',
      },
    };

    return (
      sourceStyles[source] || {
        icon: 'globe',
        bgColor: '#6B7280',
        textColor: '#fff',
        name: source || "Noma'lum",
      }
    );
  };

  /** @type {TableColumn[]} */
  const leadsTableColumns = useMemo(
    () => [
      // {
      //   key: 'id',
      //   title: 'ID',
      //   icon: 'barCode',
      //   width: { xs: '14%', md: '8%', xl: '6%' },
      //   minWidth: '100px',
      //   cellStyle: { whiteSpace: 'nowrap' },
      //   renderCell: (row) => <span>{row.id}</span>,
      // },
      {
        key: 'clientName',
        title: 'Ismi',
        icon: 'avatar',
        width: { xs: '40%', md: '24%', xl: '20%' },
        minWidth: '160px',
        cellStyle: {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        renderCell: (row) => {
          const value = row.clientName;
          return (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                maxWidth: '100%',
              }}
            >
              {value ? (
                <span style={{ display: 'inline-flex' }}>
                  {iconsMap.avatar}
                </span>
              ) : null}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {value || '-'}
              </span>
            </span>
          );
        },
      },
      {
        key: 'clientPhone',
        title: 'Telefon',
        icon: 'telephone',
        width: { xs: '30%', md: '18%', xl: '14%' },
        minWidth: '150px',
        cellStyle: { whiteSpace: 'nowrap' },
        renderCell: (row) => {
          const value = row.clientPhone;
          return (
            <span
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              {value ? (
                <span style={{ display: 'inline-flex' }}>
                  {iconsMap.telephone}
                </span>
              ) : null}
              <span>{formatToReadablePhoneNumber(value, true)}</span>
            </span>
          );
        },
      },
      {
        key: 'source',
        title: 'Manba',
        icon: 'globe',
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
              <span
                style={{
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  width: '14px',
                  height: '14px',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                {iconsMap[sourceStyle.icon]
                  ? cloneElement(iconsMap[sourceStyle.icon], {
                      style: { color: '#fff' },
                    })
                  : null}
              </span>
              <span
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  flex: 1,
                }}
              >
                {sourceStyle.name}
              </span>
            </div>
          );
        },
      },

      {
        key: 'operator',
        title: 'Operator 1',
        icon: 'users',
        width: { xs: '20%', md: '12%', xl: '10%' },
        minWidth: '140px',
        cellStyle: {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        renderCell: (row) => {
          const value = row.operator;
          return (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                maxWidth: '100%',
              }}
            >
              {value ? (
                <span style={{ display: 'inline-flex' }}>{iconsMap.users}</span>
              ) : null}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {findOperatorName(value)}
              </span>
            </span>
          );
        },
      },
      {
        key: 'operator2',
        title: 'Operator 2',
        icon: 'users',
        width: { xs: '20%', md: '12%', xl: '10%' },
        minWidth: '140px',
        cellStyle: {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        renderCell: (row) => {
          const value = row.operator2;
          return (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                maxWidth: '100%',
              }}
            >
              {value ? (
                <span style={{ display: 'inline-flex' }}>{iconsMap.users}</span>
              ) : null}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {findOperatorName(value, 'operator2')}
              </span>
            </span>
          );
        },
      },
      {
        key: 'branch',
        title: 'Filial',
        icon: 'presentationChart',
        width: { xs: '20%', md: '12%', xl: '10%' },
        minWidth: '140px',
        cellStyle: {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        renderCell: (row) => {
          const value = row.branch;
          return (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                maxWidth: '100%',
              }}
            >
              {value ? (
                <span style={{ display: 'inline-flex' }}>
                  {iconsMap.presentationChart}
                </span>
              ) : null}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {findBranchName(value)}
              </span>
            </span>
          );
        },
      },
      {
        key: 'purchase',
        title: "Xarid bo'ldimi",
        icon: 'wallet',
        minWidth: '140px',
        cellStyle: { whiteSpace: 'nowrap' },
        renderCell: (column) => {
          const { purchase } = column;
          if (purchase === null) return '-';
          return (
            <Badge color={purchase} variant="soft" size="md">
              <span
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                {purchase ? iconsMap.tickCircle : iconsMap.closeCircle}
                {purchase ? 'Ha' : "Yo'q"}
              </span>
            </Badge>
          );
        },
      },
      {
        key: 'meetingConfirmed',
        title: 'Uchrashuv belgilandimi',
        icon: 'calendarDays',
        minWidth: '160px',
        cellStyle: { whiteSpace: 'nowrap' },
        renderCell: (column) => {
          const { meetingConfirmed } = column;
          if (meetingConfirmed === null) return '-';
          return (
            <Badge color={meetingConfirmed} variant="soft" size="md">
              <span
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                {meetingConfirmed ? iconsMap.tickCircle : iconsMap.closeCircle}
                {meetingConfirmed ? 'Ha' : "Yo'q"}
              </span>
            </Badge>
          );
        },
      },
      {
        key: 'meetingDate',
        title: 'Uchrashuv sanasi',
        icon: 'calendarDays',
        minWidth: '160px',
        cellStyle: { whiteSpace: 'nowrap' },
        renderCell: (column) => {
          const { meetingDate } = column;
          return (
            <span
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              {meetingDate ? iconsMap.calendarDays : null}
              {formatDate(meetingDate, 'YYYY.MM.DD', 'DD.MM.YYYY')}
            </span>
          );
        },
      },
      {
        key: 'finalLimit',
        title: 'Yakuniy limit',
        icon: 'wallet',
        width: { xs: '20%', md: '12%', xl: '10%' },
        minWidth: '140px',
        cellStyle: { whiteSpace: 'nowrap' },
        renderCell: (column) => {
          const { finalLimit } = column;
          const getLimitText = (limit) => {
            if (limit === null) return '-';
            if (limit === 0)
              return (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {iconsMap.infoCircle}
                  Limit chiqmadi
                </span>
              );
            return (
              <span
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                {iconsMap.wallet}
                {formatterPayment(limit)}
              </span>
            );
          };
          return getLimitText(finalLimit);
        },
      },
      {
        key: 'time',
        title: 'Vaqti',
        icon: 'clock',
        width: { xs: '25%', md: '14%', xl: '8%' },
        minWidth: '160px',
        cellStyle: { whiteSpace: 'nowrap' },
        renderCell: (column) => {
          const { time } = column;
          return (
            <span
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              {time ? iconsMap.clock : null}
              {formatDate(time, 'YYYY.MM.DD hh:mm', 'DD.MM.YYYY HH:mm')}
            </span>
          );
        },
      },
      {
        key: 'comment',
        title: 'Izoh',
        icon: 'chatBubble',
        width: { xs: '40%', md: '22%', xl: '20%' },
        minWidth: '160px',
        cellStyle: {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        renderCell: (row) => {
          const value = row.comment;
          if (!value) return '-';
          return (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                maxWidth: '100%',
              }}
            >
              <span style={{ display: 'inline-flex' }}>
                {iconsMap.chatBubble}
              </span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {value}
              </span>
            </span>
          );
        },
      },
    ],
    [findOperatorName, findBranchName]
  );

  return { leadsTableColumns };
}
