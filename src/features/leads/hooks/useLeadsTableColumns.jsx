import formatDate from '@/utils/formatDate';
import { useMemo, useCallback } from 'react';
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
        renderCell: (column) => {
          const { clientPhone } = column;
          return <span>{formatToReadablePhoneNumber(clientPhone, true)}</span>;
        },
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
              <span
                style={{
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  width: '14px',
                  height: '14px',
                  justifyContent: 'center',
                }}
              >
                {iconsMap[sourceStyle.icon]}
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
        width: { xs: '20%', md: '12%', xl: '10%' },
        renderCell: (column) => {
          const { operator } = column;
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
        key: 'branch',
        title: 'Filial',
        width: { xs: '20%', md: '12%', xl: '10%' },
        renderCell: (column) => {
          const { branch } = column;
          return <span>{findBranchName(branch)}</span>;
        },
      },
      {
        key: 'purchase',
        title: "Xarid bo'ldimi",
        renderCell: (column) => {
          const { purchase } = column;
          if (purchase === null) return '-';
          return (
            <Badge color={purchase} variant="soft" size="md">
              {purchase ? 'Ha' : "Yo'q"}
            </Badge>
          );
        },
      },
      {
        key: 'meetingConfirmed',
        title: 'Uchrashuv belgilandimi',
        renderCell: (column) => {
          const { meetingConfirmed } = column;
          if (meetingConfirmed === null) return '-';
          return (
            <Badge color={meetingConfirmed} variant="soft" size="md">
              {meetingConfirmed ? 'Ha' : "Yo'q"}
            </Badge>
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
        key: 'finalLimit',
        title: 'Yakuniy limit',
        width: { xs: '20%', md: '12%', xl: '10%' },
        renderCell: (column) => {
          const { finalLimit } = column;
          const getLimitText = (limit) => {
            if (limit === null) return '-';
            if (limit === 0) return <span>Limit chiqmadi</span>;
            return <span>{formatterPayment(limit)}</span>;
          };
          return getLimitText(finalLimit);
        },
      },
      {
        key: 'time',
        title: 'Vaqti',
        width: { xs: '25%', md: '14%', xl: '8%' },
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
    [findOperatorName, findBranchName]
  );

  return { leadsTableColumns };
}
