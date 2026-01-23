import { Col, Row } from '@/components/ui';
import { DeletePurchaseItemModal } from '@/features/purchases/components/modals/DeletePurchaseItemModal';
import PurchaseHeader from '@/features/purchases/components/purchase/PurchaseHeader';
import PurchasePageFooter from '@/features/purchases/components/purchase/PurchasePageFooter';
import PurchaseTable from '@/features/purchases/components/purchase/PurchaseTable';
import { usePurchaseModal } from '@/features/purchases/hooks/usePurchaseModal';
import { usePurchaseForm } from '@/features/purchases/hooks/usePurchaseForm';
import { getPurchasePermissions } from '@/features/purchases/utils/getPurchasePermissions';
import {
  courierOptions,
  warehouseOptions,
} from '@/features/purchases/utils/purchaseOptions';
import { generatePurchasePdf } from '@/features/purchases/utils/generatePurchasePdf';
import useAuth from '@/hooks/useAuth';
import { sampleData } from './sampleData';

const PURCHASE_STATUS = 'approved';

export default function Purchase() {
  const { user } = useAuth();
  const { modal, openModal, closeModal } = usePurchaseModal();
  const {
    control,
    courierValue,
    warehouseValue,
    handleCourierChange,
    handleWarehouseChange,
  } = usePurchaseForm();

  const permissions = getPurchasePermissions(user?.U_role, PURCHASE_STATUS);

  const handleDeletePurchaseItem = () => {
    closeModal();
    // Add delete logic here
  };

  const handleDownloadPdf = () => {
    const purchaseData = {
      contractNo: '83745',
      supplier:
        courierOptions.find((opt) => opt.value === courierValue)?.label ||
        'Alisher Alisherov',
      receiver: 'Alisher Alisherov',
      supplierPhone: '+998 90 000 00 02',
      receiverPhone: '+998 90 000 00 02',
      warehouse:
        warehouseOptions.find((opt) => opt.value === warehouseValue)?.label ||
        'Malika B-12',
      branch: 'Bosh office',
      date: new Date().toLocaleDateString('ru-RU'),
      items: sampleData,
    };

    generatePurchasePdf(purchaseData);
  };

  return (
    <>
      <Row gutter={6}>
        <Col fullWidth>
          <PurchaseHeader
            isEditable={permissions.canEditItems}
            status={PURCHASE_STATUS}
            courier={
              courierOptions.find((opt) => opt.value === courierValue)?.label
            }
            warehouse={
              warehouseOptions.find((opt) => opt.value === warehouseValue)
                ?.label
            }
            courierOptions={courierOptions}
            warehouseOptions={warehouseOptions}
            control={control}
            onCourierChange={handleCourierChange}
            onWarehouseChange={handleWarehouseChange}
            onDownloadPdf={handleDownloadPdf}
          />
        </Col>
        <Col fullWidth>
          <PurchaseTable
            data={sampleData}
            onOpenModal={openModal}
            editable={permissions.canEditItems}
          />
        </Col>
      </Row>
      <DeletePurchaseItemModal
        modal={modal}
        onApply={handleDeletePurchaseItem}
        onCancel={closeModal}
      />
      <PurchasePageFooter permissions={permissions} status={PURCHASE_STATUS} />
    </>
  );
}
