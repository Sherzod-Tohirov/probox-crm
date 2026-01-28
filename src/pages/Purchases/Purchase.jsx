import { Col, Row } from '@/components/ui';
import { DeletePurchaseItemModal } from '@/features/purchases/components/modals/DeletePurchaseItemModal';
import PurchaseHeader from '@/features/purchases/components/purchase/PurchaseHeader';
import PurchasePageFooter from '@/features/purchases/components/purchase/PurchasePageFooter';
import PurchaseTable from '@/features/purchases/components/purchase/PurchaseTable';
import { usePurchaseModal } from '@/features/purchases/hooks/usePurchaseModal';
import { usePurchaseForm } from '@/features/purchases/hooks/usePurchaseForm';
import { getPurchasePermissions } from '@/features/purchases/utils/getPurchasePermissions';
import { courierOptions } from '@/features/purchases/utils/purchaseOptions';
import { generatePurchasePdf } from '@/features/purchases/utils/generatePurchasePdf';
import { useCreatePurchase } from '@/hooks/data/purchases/usePurchaseItems';
import useAuth from '@/hooks/useAuth';
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import useFetchBranches from '@/hooks/data/useFetchBranches';
import selectOptionsCreator from '@/utils/selectOptionsCreator';

const DRAFT_STORAGE_KEY = 'purchase_draft_';
const PURCHASE_STATUS = 'draft';
const NEW_PURCHASE_STORAGE_KEY = DRAFT_STORAGE_KEY + 'new';

export default function Purchase() {
  const { id: contractNo } = useParams();
  const { user } = useAuth();
  const { modal, openModal, closeModal } = usePurchaseModal();
  const {
    control,
    supplier,
    courierValue,
    warehouseValue,
    handleCourierSelect,
    handleWarehouseChange,
  } = usePurchaseForm();

  const [purchaseItems, setPurchaseItems] = useState([]);
  const { data: branches } = useFetchBranches();
  const warehouseOptions = selectOptionsCreator(branches, {
    label: 'name',
    value: 'code',
  });
  const isNewPurchase = !contractNo;

  const permissions = getPurchasePermissions(user?.U_role, PURCHASE_STATUS);
  const createPurchaseMutation = useCreatePurchase(NEW_PURCHASE_STORAGE_KEY);

  // Load from localStorage for new purchases
  useEffect(() => {
    if (isNewPurchase) {
      const draftKey = DRAFT_STORAGE_KEY + 'new';
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          setPurchaseItems(draft.items || []);
        } catch (e) {
          console.error('Error loading draft:', e);
        }
      }
    }
  }, [isNewPurchase]);

  // Save to localStorage when items change (for new purchases)
  useEffect(() => {
    if (isNewPurchase && purchaseItems.length > 0) {
      localStorage.setItem(
        NEW_PURCHASE_STORAGE_KEY,
        JSON.stringify({
          items: purchaseItems,
          timestamp: new Date().toISOString(),
        })
      );
    }
  }, [purchaseItems, isNewPurchase]);

  // Add empty row for new item entry
  const tableData = useMemo(() => {
    if (permissions.canEditItems) {
      return [...purchaseItems, { _isEmptyRow: true }];
    }
    return purchaseItems;
  }, [purchaseItems, permissions.canEditItems]);
  console.log(purchaseItems, 'purchaseItems');
  const handleProductSelect = (row, product) => {
    console.log(row, product, 'row, product');
    const newItem = {
      id: Date.now(),
      product_id: product.ItemCode,
      product_name: product.ItemName,
      itemCode: product.ItemCode,
      category: product.ItemGroupName || '',
      imei: '',
      currency: 'UZS',
      prodCondition: product?.U_PROD_CONDITION || '',
      batteryCapacity: product?.Battery || '',
      quantity: 1,
      price: 0,
    };
    if (isNewPurchase) {
      // Add to local state for new purchases
      setPurchaseItems((prev) => [...prev, newItem]);
    }
  };

  const handleFieldUpdate = (itemId, field, value) => {
    if (field === 'delete') {
      if (isNewPurchase) {
        setPurchaseItems((prev) => prev.filter((item) => item.id !== itemId));
      }
    }
    if (isNewPurchase) {
      // Update local state
      setPurchaseItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, [field]: value } : item
        )
      );
    }
  };
  console.log(purchaseItems, 'purchase items');
  const handleSendToApprovel = () => {
    const payload = {
      cardCode: supplier?.code,
      whsCode: warehouseValue,
      rows: purchaseItems.map((item) => ({
        itemCode: item?.itemCode,
        quantity: item?.quantity,
        price: item?.price,
        currency: item?.currency,
        batteryCapacity: item?.batteryCapacity,
        prodCondition: item?.prodCondition,
        imei: item?.imei,
      })),
    };
    createPurchaseMutation.mutate(payload);
  };

  const handleDeletePurchaseItem = () => {
    const item = modal.data;
    if (item?.id) {
      setPurchaseItems((prev) => prev.filter((item) => item.id !== item.id));
    }
    closeModal();
  };

  const handleDownloadPdf = () => {
    const purchaseData = {
      contractNo,
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
      items: purchaseItems,
    };

    generatePurchasePdf(purchaseData);
  };
  console.log(courierValue, 'value');
  return (
    <>
      <Row gutter={6}>
        <Col fullWidth>
          <PurchaseHeader
            isEditable={permissions.canEditItems}
            status={PURCHASE_STATUS}
            courier={courierValue?.name ?? courierValue ?? ''}
            warehouse={
              warehouseOptions.find((opt) => opt.value === warehouseValue)
                ?.label
            }
            warehouseOptions={warehouseOptions}
            control={control}
            onCourierSelect={handleCourierSelect}
            onWarehouseChange={handleWarehouseChange}
            onDownloadPdf={handleDownloadPdf}
          />
        </Col>
        <Col fullWidth>
          <PurchaseTable
            data={tableData}
            onOpenModal={openModal}
            editable={permissions.canEditItems}
            contractNo={contractNo}
            onProductSelect={handleProductSelect}
            onFieldUpdate={handleFieldUpdate}
            canConfirm={permissions.canConfirmPurchase}
          />
        </Col>
      </Row>
      <DeletePurchaseItemModal
        modal={modal}
        onApply={handleDeletePurchaseItem}
        onCancel={closeModal}
      />
      <PurchasePageFooter
        permissions={permissions}
        status={PURCHASE_STATUS}
        isSendApprovalLoading={createPurchaseMutation.isPending}
        onSendToApprovel={handleSendToApprovel}
      />
    </>
  );
}
