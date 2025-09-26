import moment from 'moment';
import { useCallback, useMemo, useState } from 'react';
import { List, Box, Button } from '@components/ui';

import useAuth from '@hooks/useAuth';
import useFetchCurrency from '@hooks/data/useFetchCurrency';
import useFetchExecutors from '@hooks/data/useFetchExecutors';
import useMutatePartialPayment from '@hooks/data/clients/useMutatePartialPayment';
import useMutatePhoneConfiscated from '@hooks/data/clients/useMutatePhoneConfiscated';

import formatDate from '@utils/formatDate';
import formatterCurrency from '@utils/formatterCurrency';
import { formatToReadablePhoneNumber } from '@utils/formatPhoneNumber';

import MessengerCell from '@features/clients/components/TableCellHelpers/MessengerCell';
import AgreementDateCell from '@features/clients/components/TableCellHelpers/AgreementDateCell';
import ExecutorCell from '@features/clients/components/TableCellHelpers/ExecutorCell';
import ProductCell from '@features/clients/components/TableCellHelpers/ProductCell';
import ManualPaymentCell from '@features/clients/components/TableCellHelpers/ManualPaymentCell';
import { useSelector } from 'react-redux';

const useClientsTableColumns = (props) => {
  const { data: executors } = useFetchExecutors();
  const { data: currency } = useFetchCurrency();

  const currentClient = useSelector(
    (state) => state.page.clients.currentClient
  );
  const paymentMutation = useMutatePartialPayment();
  const phoneConfiscatedMutation = useMutatePhoneConfiscated();

  const { user } = useAuth();
  const handleCancelPayment = useCallback(async ({ column, type }) => {
    const formattedDueDate = moment(column.DueDate).format('YYYY.MM.DD');
    try {
      const commonPayload = {
        docEntry: currentClient?.['DocEntry'],
        installmentId: column?.['InstlmntID'],
      };
      if (type === 'payment') {
        const payload = {
          ...commonPayload,
          data: { DueDate: formattedDueDate, partial: false },
        };
        await paymentMutation.mutate(payload);
      }
      if (type === 'product') {
        const payload = {
          ...commonPayload,
          data: { DueDate: formattedDueDate, phoneConfiscated: false },
        };
        await phoneConfiscatedMutation.mutate(payload);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const clientsTableColumns = useMemo(
    () => [
      {
        key: 'CardCode',
        title: 'Kod',
        width: '200px',
        minWidth: '40px',
        icon: 'barCodeFilled',
      },
      {
        key: 'CardName',
        title: 'FIO',
        width: '24%',
        minWidth: '200px',
        icon: 'avatarFilled',
      },
      {
        key: 'Phone1',
        title: 'Telefon',
        renderCell: (column) => {
          if (!column?.['Phone1']) return '-';
          return formatToReadablePhoneNumber(column['Phone1']);
        },
        width: '8%',
        minWidth: '100px',
        icon: 'telephoneFilled',
      },
      { key: 'Dscription', title: 'Mahsulot', width: '18%', icon: 'products' },
      {
        key: 'InsTotal',
        title: "To'lov",
        renderCell: (column) => {
          const SUM = column.InsTotal * currency?.['Rate'];
          return (
            (
              <Box gap={1}>
                <span>{formatterCurrency(column.InsTotal, 'USD')} </span>
                <span style={{ fontWeight: 900, color: 'steelblue' }}>
                  ({formatterCurrency(SUM || 0, 'UZS')})
                </span>
              </Box>
            ) || 'Unknown'
          );
        },
        width: '14%',
        minWidth: '120px',
        icon: 'income',
      },
      {
        key: 'PaidToDate',
        title: "To'landi",
        renderCell: (column) => <ManualPaymentCell column={column} />,
        width: '14%',
        minWidth: '160px',
        icon: 'income',
      },
      {
        key: 'status',
        title: 'Holati',
        renderCell: (column) => <ProductCell column={column} />,
        width: '8%',
        minWidth: '110px',
        icon: 'calendarFact',
      },
      {
        key: 'term',
        title: 'Muddati',
        renderCell: (column) => {
          if (!column.DueDate) return 'Unknown';
          return moment(column.DueDate).format('DD.MM.YYYY');
        },
        width: '6%',
        icon: 'calendar',
      },
      {
        key: 'NewDueDate',
        title: 'Kelishildi',
        width: '15%',
        renderCell: (column) => <AgreementDateCell column={column} />,
        icon: 'calendar',
      },

      {
        key: 'comments',
        title: 'Xabarlar',
        width: '2%',
        renderCell: (column) => <MessengerCell column={column} />,
        icon: 'messengerFilled',
      },
      {
        key: 'executor',
        minWidth: '120px',
        title: 'Ijrochi',
        icon: 'avatarFilled',
        renderCell: (column) => <ExecutorCell column={column} />,
      },
    ],
    [executors, user.SlpCode]
  );

  const clientPageTableColumns = useMemo(
    () => [
      {
        key: 'InstlmntID',
        title: 'ID',
        width: '1%',
        icon: 'barCodeFilled',
        renderCell: (column) => (
          <span style={{ color: 'darkgreen' }}>{column.InstlmntID}</span>
        ),
        cellStyle: {
          textAlign: 'center',
          outline: '1px solid rgba(0,0,0,0.05)',
          borderTopLeftRadius: '10px',
          borderBottomLeftRadius: '10px',
        },
      },
      // {
      //   key: 'PaysList',
      //   title: "To'lovlar ro'yhati",
      //   width: '18%',
      //   renderCell: (column) => {
      //     if (!column.PaysList) return '-';
      //     return (
      //       <List
      //         // layout
      //         itemProps={
      //           {
      //             // initial: { scale: 0 },
      //             // animate: { scale: 1 },
      //             // exit: { scale: 0 },
      //             // transition: { duration: 0.3, ease: "easeInOut", stiffness: 100000 },
      //           }
      //         }
      //         items={column.PaysList}
      //         isCollapsible={true}
      //         renderItem={(item) => {
      //           return (
      //             <Box
      //               // layout
      //               key={item.AcctName}
      //               align="center"
      //               justify="start"
      //               style={{
      //                 padding: '0.2rem',
      //               }}
      //             >
      //               {item.AcctName && item.SumApplied
      //                 ? `Sanasi: ${formatDate(item.DocDate)} => ${
      //                     item.AcctName
      //                   } - ${formatterCurrency(item.SumApplied, 'USD')}`
      //                 : '-'}
      //             </Box>
      //           );
      //         }}
      //       />
      //     );
      //   },
      //   icon: 'calendarFact',
      // },

      {
        key: 'InsTotal',
        title: 'Jami summa',
        width: '7%',
        renderCell: (column) => {
          if (!column.InsTotal) return '0$';
          return (
            <span style={{ color: 'darkgreen' }}>
              {formatterCurrency(column.InsTotal, 'USD')}
            </span>
          );
        },
        icon: 'income',
      },
      {
        key: 'PaidToDate',
        title: "To'landi",
        width: '7%',
        renderCell: (column) => {
          return (
            <span style={{ color: 'red' }}>
              {formatterCurrency(column.PaidToDate || 0, 'USD')}
            </span>
          );
        },
        icon: 'income',
      },
      {
        key: 'DueDate',
        title: 'Muddati',
        width: '10%',
        renderCell: (column) => {
          if (!column.DueDate) return '-';
          if (moment(column.DueDate, 'DD.MM.YYYY', true).isValid())
            return column.DueDate;
          return (
            <span style={{ color: 'darkgreen' }}>
              {formatDate(column.DueDate)}
            </span>
          );
        },
        icon: 'calendar',
      },
      {
        key: 'DueDate',
        title: 'Kechikish',
        width: '10%',
        renderCell: (column) => {
          if (!column.DueDate) return '-';

          const payslist = (column.PaysList || []).sort((a, b) => {
            return moment(a.DocDate).diff(moment(b.DocDate), 'days');
          });

          const lastPaymentDate = payslist[payslist.length - 1]?.DocDate;
          if (!lastPaymentDate) return '-';
          if (column.partial || column.phoneConfiscated) {
            const isPartial = column.partial;
            return (
              <Button
                isLoading={
                  paymentMutation.isPending ||
                  phoneConfiscatedMutation.isPending
                }
                onClick={() =>
                  handleCancelPayment({
                    column,
                    type: isPartial ? 'payment' : 'product',
                  })
                }
                color={'danger'}
              >
                Bekor qilish ({isPartial ? "To'lovni" : 'Mahsulotni'}){' '}
              </Button>
            );
          }
          const diff = moment(lastPaymentDate).diff(
            moment(column.DueDate),
            'days'
          );
          const isAllPaid = payslist.reduce((acc, list) => {
            return acc + (Number(list.SumApplied) || 0);
          }, 0);

          if (isAllPaid < column.InsTotal) {
            return <span>{`To'liq emas`}</span>;
          }

          if (diff <= 0) {
            return (
              <span style={{ color: '#027243' }}>
                {diff < 0 ? `-${Math.abs(diff)}` : '0'}
              </span>
            );
          }
          return (
            <span
              style={{
                color: '#d51629',
              }}
            >{`${diff}`}</span>
          );
        },
        icon: 'calendar',
      },
      {
        key: 'Actions',
        icon: 'infoCircle',
        title: 'Batafsil',
        width: '1%',
        renderCell: (column) => {
          return (
            <Box>
              <Button
                icon="infoCircle"
                variant="text"
                onClick={() => props?.onShowPaysListInfo?.(column)}
              />
            </Box>
          );
        },
      },
    ],
    []
  );

  return { clientsTableColumns, clientPageTableColumns };
};

export default useClientsTableColumns;
