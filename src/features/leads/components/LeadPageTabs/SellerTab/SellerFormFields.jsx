import FormField from '../../LeadPageForm/FormField';
import FieldGroup from '../../LeadPageForm/FieldGroup';
import { Row } from '@components/ui';
import styles from '../leadPageTabs.module.scss';
import useAuth from '@/hooks/useAuth';

export default function SellerFormFields({
  control,
  canEdit,
  leadData,
  fieldSellType,
  fieldPurchase,
  sellerOptions,
  sellTypeOptions,
  branchOptions,
  rejectReasonOptions
}) {
  const isAcceptedFinalPercentage =
    Number(leadData?.finalPercentage) > 0 &&
    Number(leadData?.finalPercentage) <= 25;
  const { user } = useAuth();
  return (
    <>
      <FieldGroup title="Uchrashuv ma'lumotlari">
        <FormField
          name="meetingConfirmed"
          label="Uchrashuv tasdiqlandi"
          control={control}
          type="confirm"
          disabled={!canEdit}
        />
        <FormField
          name="meetingConfirmedDate"
          label="Tasdiqlangan sana"
          control={control}
          type="date"
          disabled={!canEdit}
        />
        <FormField
          name="branch2"
          label="Filial"
          control={control}
          type="select"
          options={branchOptions}
          placeholderOption={true}
          disabled={!canEdit}
        />
        <FormField
          name="seller"
          label="Sotuvchi"
          type="select"
          options={sellerOptions}
          placeholderOption={{ value: 'null', label: '-' }}
          control={control}
          disabled={!canEdit}
        />
      </FieldGroup>

      {!leadData?.finalLimit &&
        fieldSellType === 'nasiya' &&
        canEdit &&
        !isAcceptedFinalPercentage &&
        !leadData?.acceptedReason && (
          <Row className={styles['error-message']}>
            Xaridni tasdiqlash uchun limit mavjud emas
          </Row>
        )}

      <FieldGroup title="Xarid ma'lumotlari">
        <FormField
          name="saleType"
          label="Savdo turi"
          type="select"
          options={sellTypeOptions}
          control={control}
          disabled={!canEdit}
        />
        <FormField
          name="purchase"
          label="Xarid amalga oshdimi?"
          control={control}
          type={
            !leadData?.finalLimit &&
            fieldSellType === 'nasiya' &&
            !isAcceptedFinalPercentage &&
            !leadData?.acceptedReason
              ? 'confirmOnlyFalse'
              : 'confirm'
          }
          disabled={user?.U_role !== 'CEO'}
        />
        <FormField
          name="purchaseDate"
          label="Xarid sanasi"
          control={control}
          type="date"
          disabled={!canEdit || fieldPurchase !== 'true'}
        />
        <FormField
          name="rejectionReason2"
          label="Rad etish sababi 2"
          control={control}
          type="select"
          options={rejectReasonOptions}
          placeholderOption={true}
          disabled={!canEdit}
        />
      </FieldGroup>

      <FieldGroup title="Hujjat ma'lumotlari">
        <FormField
          name="passportId"
          label="Pasport ID"
          control={control}
          type="passportId"
          disabled={!canEdit}
        />
        <FormField
          name="jshshir"
          label="JSHSHIR"
          control={control}
          type="jshshir"
          disabled={!canEdit}
        />
      </FieldGroup>
    </>
  );
}
