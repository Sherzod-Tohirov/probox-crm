import { Col, Row } from '@/components/ui';
import { DeletePurchaseItemModal } from '@/features/purchases/components/modals/DeletePurchaseItemModal';
import PurchaseHeader from '@/features/purchases/components/purchase/PurchaseHeader';
import PurchasePageFooter from '@/features/purchases/components/purchase/PurchasePageFooter';
import PurchaseTable from '@/features/purchases/components/purchase/PurchaseTable';
import { usePurchaseModal } from '@/features/purchases/hooks/usePurchaseModal';
import { usePurchaseForm } from '@/features/purchases/hooks/usePurchaseForm';
import { usePurchaseData } from '@/features/purchases/hooks/usePurchaseData';
import { usePurchaseActions } from '@/features/purchases/hooks/usePurchaseActions';
import { usePurchaseMutationsHandlers } from '@/features/purchases/hooks/usePurchaseMutationsHandlers';
import { getPurchasePermissions } from '@/features/purchases/utils/getPurchasePermissions';
import { generatePurchasePdf } from '@/features/purchases/utils/generatePurchasePdf';
import { generatePurchasePayload } from '@/features/purchases/utils/generatePurchasePayload';
import {
  useCancelPurchase,
  useConfirmPurchase,
  useCreatePurchase,
  useUpdatePurchase,
} from '@/hooks/data/purchases/usePurchaseMutations';
import useAuth from '@/hooks/useAuth';
import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import useFetchBranches from '@/hooks/data/useFetchBranches';
import selectOptionsCreator from '@/utils/selectOptionsCreator';
import useFetchPurchase from '@/hooks/data/purchases/useFetchPurchase';
import usePurchasePdfs from '@/features/purchases/hooks/usePurchasePdfs';
import _ from 'lodash';
import { downloadFile, fetchFile } from '@/utils/downloadFile';
import useAlert from '@/hooks/useAlert';

const DRAFT_STORAGE_KEY = 'purchase_draft_';
const NEW_PURCHASE_STORAGE_KEY = DRAFT_STORAGE_KEY + 'new';

export default function Purchase() {
  const { id: contractNo } = useParams();
  const { docEntry, source, statusState = 'draft' } = useLocation().state || {};
  const { checkPdfExists, uploadPdfsMutation } = usePurchasePdfs(docEntry);
  const { user } = useAuth();
  const { alert } = useAlert();
  const { modal, openModal, closeModal } = usePurchaseModal();
  const { data: purchase } = useFetchPurchase({
    docEntry,
    source,
    enabled: !!docEntry && !!source,
  });
  const status = purchase?.status ?? statusState;
  const {
    control,
    supplier,
    courierValue,
    warehouseValue,
    handleCourierSelect,
    handleWarehouseChange,
  } = usePurchaseForm({
    supplier: purchase?.cardCode,
    warehouse: purchase?.whsCode,
  });
  const { data: branches } = useFetchBranches();
  const warehouseOptions = selectOptionsCreator(branches, {
    label: 'name',
    value: 'code',
  });
  const isNewPurchase = !contractNo;

  // Permissions
  const permissions = getPurchasePermissions(user?.U_role, status);

  // Mutations
  const createPurchaseMutation = useCreatePurchase(NEW_PURCHASE_STORAGE_KEY);
  const approvePurchaseMutation = useConfirmPurchase();
  const cancelPurchaseMutation = useCancelPurchase();
  const updatePurchaseMutation = useUpdatePurchase(
    contractNo ? DRAFT_STORAGE_KEY + contractNo : null
  );

  // Purchase ma'lumotlarini yuklash va boshqarish
  const { purchaseItems, setPurchaseItems } = usePurchaseData({
    purchase,
    contractNo,
    isNewPurchase,
  });

  // Purchase harakatlari
  const { handleProductSelect, handleFieldUpdate, handleDeleteItem } =
    usePurchaseActions({
      setPurchaseItems,
      warehouseValue,
    });

  // Mutation handlerlar
  const { handleSendToApprovel, handleConfirmPurchase, handleCancelPurchase } =
    usePurchaseMutationsHandlers({
      purchaseItems,
      supplier,
      warehouseValue,
      isNewPurchase,
      docEntry,
      createPurchaseMutation,
      updatePurchaseMutation,
      approvePurchaseMutation,
      cancelPurchaseMutation,
    });

  // Bo'sh qator qo'shish uchun table data
  const tableData = useMemo(() => {
    if (permissions.canEditItems) {
      return [...purchaseItems, { _isEmptyRow: true }];
    }
    return purchaseItems;
  }, [purchaseItems, permissions.canEditItems]);

  // Modal orqali item o'chirish
  const handleDeletePurchaseItem = () => {
    const item = modal.data;
    handleDeleteItem(item?.id);
    closeModal();
  };
  // PDF yuklab olish
  const handleDownloadPdf = async () => {
    // Filelarni yuklash
    const { exists, data } = await checkPdfExists();
    if (exists) {
      const pdfItem = data?.items[0];
      if (!(pdfItem && _.has(pdfItem, 'pdfUrl'))) {
        alert('PDF yuklashda xatolik yuz berdi', { type: 'error' });
        return;
      }
      const blob = await fetchFile(pdfItem.pdfUrl);
      downloadFile(blob, `Yuk_xati_${contractNo}.pdf`);
      alert('PDF yuklab olish muvaffaqiyatli');
      return;
    }

    const purchaseData = generatePurchasePayload({
      contractNo,
      purchase,
      supplier,
      courierValue,
      warehouseValue,
      warehouseOptions,
      branches,
      user,
      purchaseItems,
      status,
      docEntry,
    });
    const blob = await generatePurchasePdf(purchaseData);
    if (!docEntry) return;
    const fileName = `Yuk_xati_${docEntry}.pdf`;
    const file = new File([blob], fileName, {
      type: 'application/pdf',
    });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('docEntry', String(docEntry));
    uploadPdfsMutation.mutate(formData);
  };
  return (
    <>
      <Row gutter={6}>
        <Col fullWidth>
          <PurchaseHeader
            isEditable={permissions.canEditItems}
            status={status}
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
            warehouseOptions={warehouseOptions}
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
        status={status}
        actions={{
          approval: {
            run: handleSendToApprovel,
            loading: !!(
              createPurchaseMutation.isPending ||
              updatePurchaseMutation.isPending
            ),
          },
          confirm: {
            run: handleConfirmPurchase,
            loading: approvePurchaseMutation.isPending,
          },
          cancel: {
            run: handleCancelPurchase,
            loading: cancelPurchaseMutation.isPending,
          },
        }}
      />
    </>
  );
}
