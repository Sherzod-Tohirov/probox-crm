import Table from '@/components/ui/Table';
import { usePurchaseTableColumns } from '../../hooks/usePurchaseTableColumns';

export default function PurchaseTable({
  data,
  onOpenModal,
  editable = false,
  contractNo,
  onProductSelect,
  onFieldUpdate,
  canConfirm = false,
  warehouseOptions = [],
}) {
  const { purchaseTableColumns, scannerModal } = usePurchaseTableColumns({
    onOpenModal,
    editable,
    contractNo,
    onProductSelect,
    onFieldUpdate,
    canConfirm,
    warehouseOptions,
  });

  return (
    <>
      <Table
        showPivotColumn
        scrollable
        data={data}
        columns={purchaseTableColumns}
        getRowStyles={() => {}}
      />
      {scannerModal}
    </>
  );
}
