import Table from '@/components/ui/Table';
import { usePurchaseTableColumns } from '../../hooks/usePurchaseTableColumns';

export default function PurchaseTable({ data, onOpenModal, editable = false }) {
  const { purchaseTableColumns } = usePurchaseTableColumns({
    onOpenModal,
    editable,
  });
  return (
    <Table
      showPivotColumn
      scrollable
      data={data}
      columns={purchaseTableColumns}
      getRowStyles={() => {}}
    />
  );
}
