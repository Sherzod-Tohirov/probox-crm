import { useMemo } from 'react';

export function usePurchaseTableColumns() {
  const purchaseTableColumns = useMemo(
    () => [
      {
        key: 'product_name',
        title: 'Mahsulot nomi',
        icon: 'products',
        width: '10%',
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
      },
      {
        key: 'actions',
        title: 'Actions',
        icon: 'products',
        width: '10%',
      },
    ],
    []
  );
  return { purchaseTableColumns };
}
