import { Badge, Button, Typography } from '@/components/ui';
// import { formatCurrencyUZS } from '@/features/leads/utils/deviceUtils';
import { getBatteryColor, normalizeBattery } from '@/utils/battery';
import { useMemo, useState } from 'react';
import { MODAL_TYPES } from '../utils/constants';
import ProductSearchCell from '../components/cells/ProductSearchCell';
import TextInputCell from '../components/cells/TextInputCell';
import NumberInputCell from '../components/cells/NumberInputCell';
import SelectInputCell from '../components/cells/SelectInputCell';
import ImeiScannerModal from '../components/modals/ImeiScannerModal';
import formatterCurrency from '@/utils/formatterCurrency';

const categoryColorMap = {
  iPhone: 'info',
  'Maishiy texnika': 'warning',
  Kompyuterlar: 'success',
  Aksessuarlar: 'black',
};

const STATUS_OPTIONS = [
  { value: 'Yangi', label: 'Yangi' },
  { value: 'B/U', label: 'B/U' },
];

const CURRENCY_OPTIONS = [
  { value: 'UZS', label: 'UZS' },
  { value: 'USD', label: 'USD' },
];

export function usePurchaseTableColumns({
  onOpenModal,
  editable,
  onProductSelect,
  onFieldUpdate,
  canConfirm,
  warehouseOptions = [],
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
        key: 'itemCode',
        title: 'Mahsulot kod',
        icon: 'products',
        width: '10%',
        renderCell: (row) => {
          if (!row.id) return null;
          return <Typography>{row?.itemCode}</Typography>;
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
              {row?.category || "Ma'lum emas"}
            </Badge>
          );
        },
      },
      {
        key: 'whsCode',
        title: 'Omborxona',
        icon: 'warehouse',
        minWidth: '110px',
        width: '10%',
        renderCell: (row) => {
          if (!row.id) return null;
          if (editable && warehouseOptions.length > 0) {
            return (
              <SelectInputCell
                options={warehouseOptions}
                value={row?.whsCode}
                placeholder="Omborxona"
                onChange={(value) => onFieldUpdate(row.id, 'whsCode', value)}
              />
            );
          }
          const warehouseLabel = warehouseOptions.find(
            (opt) => opt.value === row?.whsCode
          )?.label;
          return (
            <Typography>{warehouseLabel || row?.whsCode || 'N/A'}</Typography>
          );
        },
      },
      {
        key: 'imei',
        title: 'Seriya kodi',
        icon: 'barCodeFilled',
        minWidth: '170px',
        width: '12%',
        renderCell: (row) => {
          if (!row.id) return null;
          if (editable) {
            return (
              <TextInputCell
                value={row?.imei}
                placeholder="IMEI"
                withScanner
                onScanClick={() => handleScanClick(row.id)}
                onBlur={(value) => onFieldUpdate(row.id, 'imei', value)}
              />
            );
          }
          return <Typography>{row?.imei}</Typography>;
        },
      },
      {
        key: 'prodCondition',
        title: 'Holati',
        icon: 'products',
        width: '5%',
        renderCell: (row) => {
          if (!row.id) return null;
          if (editable && !row?.prodCondition) {
            return (
              <SelectInputCell
                options={STATUS_OPTIONS}
                placeholder="Holati"
                value={row?.prodCondition}
                onChange={(value) =>
                  onFieldUpdate(row.id, 'prodCondition', value)
                }
              />
            );
          }
          return <Typography>{row?.prodCondition}</Typography>;
        },
      },
      {
        key: 'batteryCapacity',
        title: 'Batareya foizi',
        icon: 'battery',
        width: '6%',
        renderCell: (row) => {
          if (!row.id) return null;
          const isProductNew = row?.prodCondition === 'Yangi';
          if (editable) {
            return (
              <NumberInputCell
                value={isProductNew ? '100' : row?.batteryCapacity}
                placeholder="Foiz"
                icon="battery"
                isPercentage
                onBlur={(value) =>
                  onFieldUpdate(row.id, 'batteryCapacity', value)
                }
              />
            );
          }
          return (
            <Badge color={getBatteryColor(row?.batteryCapacity, isProductNew)}>
              {normalizeBattery(row?.batteryCapacity, isProductNew)}
            </Badge>
          );
        },
      },
      {
        key: 'quantity',
        title: 'Miqdor',
        icon: 'products',
        width: '6%',
        renderCell: (row) => {
          if (!row.id) return null;
          if (editable && !row.imei) {
            return (
              <NumberInputCell
                onBlur={(value) => onFieldUpdate(row.id, 'quantity', value)}
                value={row?.quantity}
                placeholder="0"
              />
            );
          }
          return <Typography>{row?.quantity || 1}</Typography>;
        },
      },
      {
        key: 'currency',
        title: 'Valyuta',
        icon: 'income',
        width: '5%',
        renderCell: (row) => {
          if (!row.id) return null;
          if (editable) {
            return (
              <SelectInputCell
                options={CURRENCY_OPTIONS}
                value={row?.currency}
                placeholder="UZS"
                onChange={(value) => onFieldUpdate(row.id, 'currency', value)}
              />
            );
          }
          return <Typography>{row?.currency || 'UZS'}</Typography>;
        },
      },
      {
        key: 'price',
        title: 'Narxi',
        icon: 'products',
        minWidth: '150px',
        width: '12%',
        renderCell: (row) => {
          if (!row.id) return null;
          if (editable) {
            return (
              <NumberInputCell
                value={row?.price}
                placeholder="0"
                isCurrency
                iconText={row.currency}
                onBlur={(value) => onFieldUpdate(row.id, 'price', value)}
              />
            );
          }
          return (
            <Typography color="info">
              {formatterCurrency(row?.price, row?.currency)}
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
          if (!editable) return '-';
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
    [
      onOpenModal,
      editable,
      onProductSelect,
      onFieldUpdate,
      canConfirm,
      warehouseOptions,
    ]
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
