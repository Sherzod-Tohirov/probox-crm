import { useEffect } from 'react';
import { Row } from '@components/ui';
import FormField from '../LeadPageForm/FormField';
import FieldGroup from '../LeadPageForm/FieldGroup';
import TabHeader from './TabHeader';
import useScoringForm from '../../hooks/useScoringForm.jsx';
import styles from './leadPageTabs.module.scss';

export default function ScoringTab({ leadId, leadData, canEdit, onSuccess }) {
  const { form, handleSubmit, isSubmitting, error } = useScoringForm(
    leadId,
    leadData,
    onSuccess
  );

  const { control, reset } = form || {};

  // Reset form when leadData changes
  useEffect(() => {
    if (!form) return;
    if (leadData) {
      reset({
        employeeName: leadData.employeeName || '',
        region: leadData.region || '',
        district: leadData.district || '',
        address: leadData.address || '',
        birthDate: leadData.birthDate || '',
        applicationDate: leadData.applicationDate || '',
        age: leadData.age || '',
        score: leadData.score || '',
        katm: leadData.katm || '',
        katmPayment: leadData.katmPayment || '',
        paymentHistory: leadData.paymentHistory || '',
        mib: leadData.mib || '',
        mibIrresponsible: leadData.mibIrresponsible || false,
        aliment: leadData.aliment || '',
        officialSalary: leadData.officialSalary || '',
        finalLimit: leadData.finalLimit || '',
        finalPercentage: leadData.finalPercentage || '',
      });
    }
  }, [leadData, reset]);

  return (
    <Row direction="column" className={styles['tab-content']}>
      <TabHeader
        title="Tekshirish Xodimi Ma'lumotlari"
        onSave={handleSubmit}
        disabled={!canEdit}
        isSubmitting={isSubmitting}
      />

      <form onSubmit={handleSubmit}>
        <FieldGroup title="Xodim ma'lumotlari">
          <FormField
            name="employeeName"
            label="Xodim F.I.O"
            control={control}
            disabled={!canEdit}
          />
        </FieldGroup>

        <FieldGroup title="Manzil ma'lumotlari">
          <FormField
            name="region"
            label="Viloyat"
            control={control}
            disabled={!canEdit}
          />
          <FormField
            name="district"
            label="Tuman"
            control={control}
            disabled={!canEdit}
          />
          <FormField
            name="address"
            label="Manzil"
            control={control}
            disabled={!canEdit}
          />
        </FieldGroup>

        <FieldGroup title="Shaxsiy ma'lumotlar">
          <FormField
            name="birthDate"
            label="Tug'ilgan sana"
            control={control}
            type="date"
            disabled={!canEdit}
          />
          <FormField
            name="applicationDate"
            label="Ariza sanasi"
            control={control}
            type="date"
            disabled={!canEdit}
          />
          <FormField
            name="age"
            label="Yosh"
            control={control}
            type="number"
            disabled={!canEdit}
          />
          <FormField
            name="score"
            label="Ball (score)"
            control={control}
            type="number"
            disabled={!canEdit}
          />
        </FieldGroup>

        <FieldGroup title="KATM va To'lov ma'lumotlari">
          <FormField
            name="katm"
            label="KATM"
            control={control}
            disabled={!canEdit}
          />
          <FormField
            name="katmPayment"
            label="KATM to'lov"
            control={control}
            disabled={!canEdit}
          />
          <FormField
            name="paymentHistory"
            label="To'lov tarixi"
            control={control}
            disabled={!canEdit}
          />
        </FieldGroup>

        <FieldGroup title="MIB va Boshqa ma'lumotlar">
          <FormField
            name="mib"
            label="MIB"
            control={control}
            disabled={!canEdit}
          />
          <FormField
            name="mibIrresponsible"
            label="MIB mas'uliyatsiz"
            control={control}
            type="boolean"
            disabled={!canEdit}
          />
          <FormField
            name="aliment"
            label="Aliment"
            control={control}
            disabled={!canEdit}
          />
        </FieldGroup>

        <FieldGroup title="Yakuniy ma'lumotlar">
          <FormField
            name="officialSalary"
            label="Rasmiy oylik"
            control={control}
            type="number"
            disabled={!canEdit}
          />
          <FormField
            name="finalLimit"
            label="Yakuniy limit"
            control={control}
            type="number"
            disabled={!canEdit}
          />
          <FormField
            name="finalPercentage"
            label="Yakuniy foiz"
            control={control}
            type="number"
            disabled={!canEdit}
          />
        </FieldGroup>
      </form>

      {error && (
        <Row className={styles['error-message']}>
          Xatolik yuz berdi: {error.message}
        </Row>
      )}
    </Row>
  );
}
