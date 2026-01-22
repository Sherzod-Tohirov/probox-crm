import Table from '@/components/ui/Table';
import { usePurchaseTableColumns } from '../../hooks/usePurchaseTableColumns';

export default function PurchaseTable({ data }) {
  const { purchaseTableColumns } = usePurchaseTableColumns();
  return (
    <Table
      showPivotColumn
      data={data}
      columns={purchaseTableColumns}
      getRowStyles={() => {}}
    />
  );
}
