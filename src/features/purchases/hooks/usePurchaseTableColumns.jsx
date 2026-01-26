import { Badge, Button, Typography } from '@/components/ui';
import { formatCurrencyUZS } from '@/features/leads/utils/deviceUtils';
import { getBatteryColor, normalizeBattery } from '@/utils/battery';
import { useMemo, useState } from 'react';
import { MODAL_TYPES } from '../utils/constants';
import ProductSearchCell from '../components/cells/ProductSearchCell';
import TextInputCell from '../components/cells/TextInputCell';
import NumberInputCell from '../components/cells/NumberInputCell';
import SelectInputCell from '../components/cells/SelectInputCell';
import ImeiScannerModal from '../components/modals/ImeiScannerModal';

const categoryColorMap = {
  Telefonlar: 'info',
  'Maishiy texnika': 'warning',
  Kompyuterlar: 'success',
  Aksessuarlar: 'black',
};

export function usePurchaseTableColumns({
  onOpenModal,
  editable,
  onProductSelect,
  onFieldUpdate,
  canConfirm,
} = {}) {
  const [scanningItemId, setScanningItemId] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleScanClick = (itemId) => {
    setScanningItemId(itemId);
    setIsScannerOpen(true);
  };

  const handleScanComplete = (imei) => {
    if (scanningItemId) {
      onFieldUpdate(scanningItemId, 'imei', imei);
    }
    setIsScannerOpen(false);
    setScanningItemId(null);
  };
  const purchaseTableColumns = useMemo(
    () => [
      {
        key: 'product_name',
        title: 'Mahsulot nomi',
        icon: 'products',
        width: '15%',
        minWidth: '200px',
        renderCell: (row) => {
          if (editable && !row.id) {
            return (
              <ProductSearchCell
                value={row?.product_name}
                onSelect={(product) => onProductSelect(row, product)}
              />
            );
          }
          return <Typography>{row?.product_name}</Typography>;
        },
      },
      {
        key: 'product_code',
        title: 'Mahsulot kod',
        icon: 'products',
        width: '10%',
        renderCell: (row) => {
          if (!row.id) return null;
          return <Typography>{row?.product_code}</Typography>;
        },
      },
      {
        key: 'category',
        title: 'Kategoriyalar',
        icon: 'products',
        width: '10%',
        renderCell: (row) => {
          if (!row.id) return null;
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
        width: '12%',
        renderCell: (row) => {
          if (!row.id) return null;
          if (editable) {
            return (
              <TextInputCell
                value={row?.imei}
                onBlur={(value) => onFieldUpdate(row.id, 'imei', value)}
                placeholder="IMEI"
                withScanner
                onScanClick={() => handleScanClick(row.id)}
              />
            );
          }
          return <Typography>{row?.imei}</Typography>;
        },
      },
      {
        key: 'status',
        title: 'Holati',
        icon: 'products',
        width: '10%',
        renderCell: (row) => {
          if (!row.id) return null;
          if (editable) {
            return (
              <SelectInputCell
                value={row?.status}
                onChange={(value) => onFieldUpdate(row.id, 'status', value)}
              />
            );
          }
          return <Typography>{row?.status}</Typography>;
        },
      },
      {
        key: 'battery',
        title: 'Batareya foizi',
        icon: 'battery',
        width: '10%',
        renderCell: (row) => {
          if (!row.id) return null;
          const isProductNew = row?.status === 'Yangi';
          if (editable) {
            return (
              <NumberInputCell
                value={row?.battery}
                onBlur={(value) => onFieldUpdate(row.id, 'battery', value)}
                placeholder="Foiz"
                icon="battery"
                isPercentage
              />
            );
          }
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
        width: '8%',
        renderCell: (row) => {
          if (!row.id) return null;
          if (editable) {
            return (
              <NumberInputCell
                value={row?.count}
                onBlur={(value) => onFieldUpdate(row.id, 'count', value)}
                placeholder="0"
              />
            );
          }
          return <Typography>{row?.count || 1}</Typography>;
        },
      },
      {
        key: 'price',
        title: 'Narxi',
        icon: 'products',
        width: '12%',
        renderCell: (row) => {
          if (!row.id) return null;
          if (editable) {
            return (
              <NumberInputCell
                value={row?.price}
                onBlur={(value) => onFieldUpdate(row.id, 'price', value)}
                placeholder="0"
                isCurrency
                iconText="UZS"
              />
            );
          }
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
        width: '8%',
        renderCell: (row) => {
          if (!row.id) return null;
          const shouldShowModal = canConfirm;
          return (
            <Button
              icon="delete"
              variant="text"
              onClick={() => {
                if (shouldShowModal) {
                  onOpenModal(MODAL_TYPES.DELETE_PURCHASE_ITEM, row);
                } else {
                  onFieldUpdate(row.id, 'delete', true);
                }
              }}
            />
          );
        },
      },
    ],
    [onOpenModal, editable, onProductSelect, onFieldUpdate, canConfirm]
  );

  return {
    purchaseTableColumns,
    scannerModal: (
      <ImeiScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleScanComplete}
      />
    ),
  };
}
