import formatDate from '@/utils/formatDate';
import { useMemo, useCallback, cloneElement } from 'react';
import useFetchExecutors from '@/hooks/data/useFetchExecutors';
import useFetchBranches from '@/hooks/data/useFetchBranches';
import iconsMap from '@utils/iconsMap';
import { Badge } from '@/components/ui';
import { formatToReadablePhoneNumber } from '@/utils/formatPhoneNumber';
import formatterCurrency from '@/utils/formatterCurrency';

/**
 * @typedef {import('../../../components/ui/Table').TableColumn} TableColumn
 */

const StatusBadge = ({ status }) => {
  if (status === null) return '-';
  return (
    <Badge color={status} variant="soft" size="md">
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        {status ? iconsMap.tickCircle : iconsMap.closeCircle}
        {status ? 'Ha' : "Yo'q"}
      </span>
    </Badge>
  );
};

export default function useLeadsTableColumns() {
  const { data: executors = [] } = useFetchExecutors();
  const { data: branchList = [] } = useFetchBranches();

  const findOperatorName = useCallback(
    (operatorCode) => {
      const operator = executors.find(
        (operator) => String(operator.SlpCode) === String(operatorCode)
      );
      return operator?.SlpName || '-';
    },
    [executors]
  );

  const findBranchName = useCallback(
    (branchCode) => {
      const branch = branchList.find(
        (branch) => String(branch._id) === String(branchCode)
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

  const getLimitText = (limit) => {
    if (limit === null) return '-';
    if (limit === 0)
      return (
        <Badge color="danger" size="md">
          Limit chiqmadi
        </Badge>
      );
    const getLimitColor = (limit) => {
      if (limit < 25_000_000) return 'success';
      if (limit >= 25_000_000) return 'extrasuccess';
      return 'warning';
    };
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        {
          <Badge color={getLimitColor(limit)} size="md">
            {iconsMap.wallet}
            {formatterCurrency(limit, 'UZS')}
          </Badge>
        }
      </span>
    );
  };

  /** @type {TableColumn[]} */
  const leadsTableColumns = useMemo(
    () => [
      {
        key: 'n',
        title: 'ID',
        icon: 'barCode',
        width: { xs: '14%', md: '8%', xl: '6%' },
        minWidth: '100px',
        cellStyle: { whiteSpace: 'nowrap' },
        renderCell: (row) => <span>{row.n}</span>,
      },
      {
        key: 'finalLimit',
        title: 'Yakuniy limit',
        icon: 'products',
        width: { xs: '20%', md: '12%', xl: '10%' },
        minWidth: '140px',
        cellStyle: { whiteSpace: 'nowrap' },
        renderCell: (column) => {
          const { finalLimit } = column;
          return getLimitText(finalLimit);
        },
      },
      {
        key: 'clientName',
        title: 'Ismi',
        icon: 'avatarFilled',
        width: { xs: '40%', md: '24%', xl: '20%' },
        minWidth: '160px',
        maxWidth: '200px',
        cellStyle: {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        renderCell: (row) => {
          const value = row.clientName;
          return (
            <span
              title={value}
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
        icon: 'telephoneFilled',
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
        icon: 'globeFilled',
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
                <span style={{ display: 'inline-flex' }}>
                  {iconsMap.avatar}
                </span>
              ) : null}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {findOperatorName(value)}
              </span>
            </span>
          );
        },
      },
      {
        key: 'called',
        title: 'Telefon qilindimi',
        icon: 'telephone',
        minWidth: '160px',
        cellStyle: { whiteSpace: 'nowrap' },
        renderCell: (row) => {
          const value = row.called;
          return <StatusBadge status={value} />;
        },
      },
      {
        key: 'answered',
        title: 'Javob berildimi',
        icon: 'telephoneFilled',
        minWidth: '160px',
        cellStyle: { whiteSpace: 'nowrap' },
        renderCell: (row) => {
          const value = row.answered;
          return <StatusBadge status={value} />;
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
                <span style={{ display: 'inline-flex' }}>
                  {iconsMap.avatar}
                </span>
              ) : null}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {findOperatorName(value)}
              </span>
            </span>
          );
        },
      },
      {
        key: 'called2',
        title: 'Telefon qilindimi 2',
        icon: 'telephoneFilled',
        minWidth: '160px',
        cellStyle: { whiteSpace: 'nowrap' },
        renderCell: (row) => {
          const value = row.called2;
          return <StatusBadge status={value} />;
        },
      },
      {
        key: 'answered2',
        title: 'Javob berildimi 2',
        icon: 'telephoneFilled',
        minWidth: '160px',
        cellStyle: { whiteSpace: 'nowrap' },
        renderCell: (row) => {
          const value = row.answered2;
          return <StatusBadge status={value} />;
        },
      },
      {
        key: 'seller',
        title: 'Sotuvchi',
        icon: 'users',
        width: { xs: '20%', md: '12%', xl: '10%' },
        minWidth: '140px',
        cellStyle: {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        renderCell: (row) => {
          const value = row.seller;
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
                {findOperatorName(value)}
              </span>
            </span>
          );
        },
      },
      {
        key: 'scoring',
        title: 'Scoring',
        icon: 'users',
        width: { xs: '20%', md: '12%', xl: '10%' },
        minWidth: '140px',
        cellStyle: {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        renderCell: (row) => {
          const value = row.scoring;
          console.log(value, 'scoring');
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
              {value ? (
                <span style={{ display: 'inline-flex' }}>
                  {iconsMap.avatar}
                </span>
              ) : null}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {findOperatorName(value)}
              </span>
            </span>
          );
        },
      },
      {
        key: 'branch2',
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
          const value = row.branch2;
          return (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                maxWidth: '100%',
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {findBranchName(value)}
              </span>
            </span>
          );
        },
      },
      {
        key: 'idX',
        title: 'Passport ID',
        icon: 'barCodeFilled',
        width: { xs: '20%', md: '12%', xl: '10%' },
        minWidth: '140px',
        cellStyle: {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        renderCell: (row) => {
          const value = row.idX;
          return (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                maxWidth: '100%',
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {value}
              </span>
            </span>
          );
        },
      },
      {
        key: 'jshshir',
        title: 'JSHSHIR',
        icon: 'barCodeFilled',
        width: { xs: '20%', md: '12%', xl: '10%' },
        minWidth: '140px',
        cellStyle: {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        renderCell: (row) => {
          const value = row.jshshir;
          return (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                maxWidth: '100%',
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {value}
              </span>
            </span>
          );
        },
      },
      {
        key: 'purchase',
        title: "Xarid bo'ldimi",
        icon: 'products',
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
        icon: 'calendar',
        minWidth: '160px',
        cellStyle: { whiteSpace: 'nowrap' },
        renderCell: (column) => {
          const { meetingConfirmed } = column;
          return <StatusBadge status={meetingConfirmed} />;
        },
      },
      {
        key: 'meetingDate',
        title: 'Uchrashuv sanasi',
        icon: 'calendar',
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
        key: 'finalPercentage',
        title: 'Yakuniy foiz',
        icon: 'products',
        width: { xs: '20%', md: '12%', xl: '10%' },
        minWidth: '140px',
        cellStyle: { whiteSpace: 'nowrap' },
        renderCell: (column) => {
          const { finalPercentage } = column;
          if (finalPercentage === null) return '-';
          return finalPercentage + ' %';
        },
      },
      {
        key: 'time',
        title: 'Vaqti',
        icon: 'clockFilled',
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
        maxWidth: '300px',
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
