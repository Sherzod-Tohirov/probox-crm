import Table from '@/components/ui/Table';
import { usePurchaseTableColumns } from '../../hooks/usePurchaseTableColumns';

export default function PurchaseTable({ data, onOpenModal }) {
  const { purchaseTableColumns } = usePurchaseTableColumns({
    onOpenModal,
  });
  return (
    <Table
      showPivotColumn
      data={data}
      columns={purchaseTableColumns}
      getRowStyles={() => {}}
    />
  );
}
