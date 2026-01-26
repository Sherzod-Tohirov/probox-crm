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
import {
  // useCreatePurchaseItem,
  useUpdatePurchaseItem,
  useDeletePurchaseItem,
} from '@/hooks/data/purchases/usePurchaseItems';
import useAuth from '@/hooks/useAuth';
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

const DRAFT_STORAGE_KEY = 'purchase_draft_';
const PURCHASE_STATUS = 'draft';

export default function Purchase() {
  const { id: contractNo } = useParams();
  console.log(contractNo, 'xontractno');
  const { user } = useAuth();
  const { modal, openModal, closeModal } = usePurchaseModal();
  const {
    control,
    courierValue,
    warehouseValue,
    handleCourierChange,
    handleWarehouseChange,
  } = usePurchaseForm();

  const [purchaseItems, setPurchaseItems] = useState([]);
  const isNewPurchase = !contractNo;

  const permissions = getPurchasePermissions(user?.U_role, PURCHASE_STATUS);
  // const createItemMutation = useCreatePurchaseItem(contractNo);
  const updateItemMutation = useUpdatePurchaseItem(contractNo);
  const deleteItemMutation = useDeletePurchaseItem(contractNo);

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
      const draftKey = DRAFT_STORAGE_KEY + 'new';
      localStorage.setItem(
        draftKey,
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

  const handleProductSelect = (row, product) => {
    console.log(row, product, 'row, product');
    const newItem = {
      id: Date.now(),
      product_id: product.ItemCode,
      product_name: product.ItemName,
      product_code: product.ItemCode,
      category: product.U_Category || '',
      imei: '',
      status: '',
      battery: '',
      count: 1,
      price: product.Price || 0,
    };
    console.log(purchaseItems, 'purchaseItems');
    if (isNewPurchase) {
      // Add to local state for new purchases
      setPurchaseItems((prev) => [...prev, newItem]);
    } else {
      // Create item via API for existing purchases
      // createItemMutation.mutate({
      //   product_id: newItem.product_id,
      //   product_code: newItem.product_code,
      //   category: newItem.category,
      //   price: newItem.price,
      // });
    }
  };

  const handleFieldUpdate = (itemId, field, value) => {
    if (field === 'delete') {
      if (isNewPurchase) {
        setPurchaseItems((prev) => prev.filter((item) => item.id !== itemId));
      } else {
        deleteItemMutation.mutate(itemId);
      }
      return;
    }

    if (isNewPurchase) {
      // Update local state
      setPurchaseItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, [field]: value } : item
        )
      );
    } else {
      // Update via API
      updateItemMutation.mutate({
        itemId,
        data: { [field]: value },
      });
    }
  };

  const handleDeletePurchaseItem = () => {
    const item = modal.data;
    if (item?.id) {
      deleteItemMutation.mutate(item.id);
    }
    closeModal();
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
      items: purchaseItems,
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
      <PurchasePageFooter permissions={permissions} status={PURCHASE_STATUS} />
    </>
  );
}
