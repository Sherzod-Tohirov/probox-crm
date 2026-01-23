import { Badge, Button, Typography } from '@/components/ui';
import { formatCurrencyUZS } from '@/features/leads/utils/deviceUtils';
import { getBatteryColor, normalizeBattery } from '@/utils/battery';
import { useMemo } from 'react';
import { MODAL_TYPES } from '../utils/constants';

const categoryColorMap = {
  Telefonlar: 'info',
  'Maishiy texnika': 'warning',
  Kompyuterlar: 'success',
  Aksessuarlar: 'black',
};

export function usePurchaseTableColumns(
  { onOpenModal, editable } = { onOpenModal: () => {}, editable: false }
) {
  const purchaseTableColumns = useMemo(
    () => [
      {
        key: 'product_name',
        title: 'Mahsulot nomi',
        icon: 'products',
        width: '10%',
        renderCell: (row) => {
          if (editable) return <Typography>{row?.product_name}</Typography>;
        },
      },
      {
        key: 'product_code',
        title: 'Mahsulot kod',
        icon: 'products',
        width: '10%',
      },
      {
        key: 'category',
        title: 'Kategoriyalar',
        icon: 'products',
        width: '10%',
        renderCell: (row) => {
          return (
            <Badge color={categoryColorMap[row?.category] || 'black'}>
              {row?.category}
            </Badge>
          );
        },
      },
      {
        key: 'imei',
        title: 'IMEI',
        icon: 'barCodeFilled',
        width: '10%',
      },
      {
        key: 'status',
        title: 'Holati',
        icon: 'products',
        width: '10%',
      },
      {
        key: 'battery',
        title: 'Batareya fiozi',
        icon: 'battery',
        width: '10%',
        renderCell: (row) => {
          const isProductNew = row?.status === 'Yangi';
          return (
            <Badge color={getBatteryColor(row?.battery, isProductNew)}>
              {normalizeBattery(row?.battery, isProductNew)}
            </Badge>
          );
        },
      },
      {
        key: 'count',
        title: 'Miqdor',
        icon: 'products',
        width: '10%',
      },
      {
        key: 'price',
        title: 'Narxi',
        icon: 'products',
        width: '10%',
        renderCell: (row) => {
          return (
            <Typography color="info">
              {formatCurrencyUZS(row?.price)}
            </Typography>
          );
        },
      },
      {
        key: 'actions',
        title: 'Actions',
        icon: 'products',
        width: '10%',
        renderCell: (row) => {
          return (
            <Button
              icon="delete"
              variant="text"
              onClick={() => onOpenModal(MODAL_TYPES.DELETE_PURCHASE_ITEM, row)}
            />
          );
        },
      },
    ],
    [onOpenModal]
  );
  return { purchaseTableColumns };
}
