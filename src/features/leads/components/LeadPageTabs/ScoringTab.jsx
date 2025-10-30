import { useEffect } from 'react';
import { Row } from '@components/ui';
import FormField from '../LeadPageForm/FormField';
import FieldGroup from '../LeadPageForm/FieldGroup';
import TabHeader from './TabHeader';
import useScoringForm from '../../hooks/useScoringForm.jsx';
import styles from './leadPageTabs.module.scss';
import { getKATMInfo, MAX_KATM_SCORE } from '@/utils/getKATMInfo';
import { getAge } from '@/utils/getAge';
import { calculateLeadLimit } from '@/utils/calculateLeadLimit';
import { PULT } from '../../utils/constants';
import formatterCurrency from '@/utils/formatterCurrency';

const regionOptions = [
  { value: 'Toshkent', label: 'Toshkent viloyati' },
  { value: "Farg'ona", label: "Farg'ona viloyati" },
  { value: 'Namangan', label: 'Namangan viloyati' },
  { value: 'Andijon', label: 'Andijon viloyati' },
  { value: 'Sirdaryo', label: 'Sirdaryo viloyati' },
  { value: 'Jizzax', label: 'Jizzax viloyati' },
  { value: 'Samarqand', label: 'Samarqand viloyati' },
  { value: 'Qashqadaryo', label: 'Qashqadaryo viloyati' },
  { value: 'Surxondaryo', label: 'Surxondaryo viloyati' },
  { value: 'Navoiy', label: 'Navoiy viloyati' },
  { value: 'Buxoro', label: 'Buxoro viloyati' },
  { value: 'Xorazm', label: 'Xorazm viloyati' },
  { value: "Qoraqalpog'iston", label: "Qoraqalpog'iston viloyati" },
];

const paymentHistoryOptions = [
  { value: '0 Kun', label: '0 Kun' },
  { value: '30 kun AQ', label: '30 kun AQ' },
  { value: 'Keyinga oy AQ', label: 'Keyinga oy AQ' },
  { value: '31-60 kun AQ', label: '31-60 kun AQ' },
  { value: '61-90 kun AQ', label: '61-90 kun AQ' },
  { value: '91 kun AQ', label: '91 kun AQ' },
  { value: 'SUD', label: 'SUD' },
  { value: 'SUD jarayoni AQ', label: 'SUD jarayoni AQ' },
  { value: '30 kun FOIZ', label: '30 kun FOIZ' },
  { value: 'Keyinga oy FOIZ', label: 'Keyinga oy FOIZ' },
  { value: '31-60 kun FOIZ', label: '31-60 kun FOIZ' },
  { value: '61-90 kun FOIZ', label: '61-90 kun FOIZ' },
  { value: '91 kun AQ FOIZ', label: '91 kun AQ FOIZ' },
  { value: 'SUD jarayoni FOIZ', label: 'SUD jarayoni FOIZ' },
];

const mibIrresponsibleOptions = [
  ...Array.from({ length: 10 }, (_, i) => ({
    value: i,
    label: i,
  })),
];

const maxBirthDate = new Date();
maxBirthDate.setFullYear(maxBirthDate.getFullYear() - 18);

// Scoring Tab

export default function ScoringTab({ leadId, leadData, canEdit, onSuccess }) {
  const { form, handleSubmit, isSubmitting, error } = useScoringForm(
    leadId,
    leadData,
    onSuccess
  );

  const { control, reset, watch, setValue } = form || {};
  const [
    fieldScore,
    fieldBirthDate,
    fieldAge,
    fieldKatm,
    fieldKatmPayment,
    fieldPaymentHistory,
    fieldMib,
    fieldMibIrresponsible,
    fieldAliment,
    fieldOfficialSalary,
    fieldApplicationDate,
  ] = watch([
    'score',
    'birthDate',
    'age',
    'katm',
    'katmPayment',
    'paymentHistory',
    'mib',
    'mibIrresponsible',
    'aliment',
    'officialSalary',
    'applicationDate',
  ]);
  // Reset form when leadData changes
  useEffect(() => {
    if (!form) return;
    if (leadData) {
      reset({
        clientFullName: leadData.clientFullName,
        region: leadData.region,
        district: leadData.district,
        address: leadData.address,
        birthDate: leadData.birthDate,
        applicationDate: leadData.applicationDate,
        age: leadData.age || '',
        score: leadData.score || '',
        katm: leadData.katm || '',
        katmPayment: leadData.katmPayment || '',
        paymentHistory: leadData.paymentHistory || '',
        mib: leadData.mib || '',
        mibIrresponsible: leadData.mibIrresponsible,
        aliment: leadData.aliment || '',
        officialSalary: leadData.officialSalary || '',
        finalLimit: leadData.finalLimit || '',
        finalPercentage: leadData.finalPercentage || '',
        acceptedReason: leadData?.acceptedReason || '',
      });
    }
  }, [leadData, reset]);
  useEffect(() => {
    if (!form) return;
    if (fieldScore !== undefined) {
      if (fieldScore > MAX_KATM_SCORE) {
        setValue('score', MAX_KATM_SCORE);
      }
      setValue('katm', getKATMInfo(fieldScore), { shouldValidate: true });
    }
  }, [fieldScore, setValue, form]);

  useEffect(() => {
    if (!form) return;
    if (fieldBirthDate !== undefined) {
      setValue('age', getAge(fieldBirthDate), { shouldValidate: true });
    }
  }, [fieldBirthDate, setValue, form]);
  useEffect(() => {
    if (!form) return;
    console.log(fieldScore, 'fieldScore');
    console.log(fieldAge, 'fieldAge');
    console.log(fieldKatm, 'fieldKatm');
    console.log(fieldKatmPayment, 'fieldKatmPayment');
    console.log(fieldPaymentHistory, 'fieldPaymentHistory');
    console.log(fieldMib, 'fieldMib');
    console.log(fieldMibIrresponsible, 'fieldMibIrresponsible');
    console.log(fieldAliment, 'fieldAliment');
    console.log(fieldOfficialSalary, 'fieldOfficialSalary');
    console.log(fieldApplicationDate, 'fieldApplicationDate');
    const isProvided = (v) =>
      v !== undefined && v !== null && v !== '' && v !== false;
    const allProvided =
      isProvided(fieldAge) &&
      isProvided(fieldKatm) &&
      isProvided(fieldKatmPayment) &&
      isProvided(fieldPaymentHistory) &&
      isProvided(fieldMib) &&
      isProvided(fieldMibIrresponsible) &&
      isProvided(fieldAliment) &&
      isProvided(fieldOfficialSalary) &&
      isProvided(fieldApplicationDate);
    console.log(allProvided, 'allProvided');
    if (allProvided) {
      const computed = calculateLeadLimit(
        {
          age: fieldAge,
          katmScore: fieldKatm,
          katmPayment: fieldKatmPayment,
          katmHistory: fieldPaymentHistory,
          mibDebt: fieldMib,
          mibIrresponsible: fieldMibIrresponsible,
          alimentDebt: fieldAliment,
          salary: fieldOfficialSalary,
        },
        PULT
      );
      setValue('finalLimit', formatterCurrency(computed), {
        shouldValidate: true,
      });
    }
  }, [
    form,
    setValue,
    fieldAge,
    fieldKatm,
    fieldKatmPayment,
    fieldPaymentHistory,
    fieldMib,
    fieldMibIrresponsible,
    fieldAliment,
    fieldOfficialSalary,
    fieldApplicationDate,
  ]);

  const acceptedReasonOptions = [
    { value: 'Yaxshi mijoz', label: 'Yaxshi mijoz' },
    { value: 'Unduruv ruxsat bergan', label: 'Undruv ruxsat bergan' },
    { value: 'Limit chiqdi', label: 'Limit chiqdi' },
  ];

  return (
    <Row direction="column" className={styles['tab-content']}>
      <TabHeader
        title="Tekshirish Xodimi Ma'lumotlari"
        onSave={handleSubmit}
        disabled={!canEdit}
        isSubmitting={isSubmitting}
      />

      <form onSubmit={handleSubmit}>
        <FieldGroup title="Mijoz ma'lumotlari">
          <FormField
            name="clientFullName"
            label="Mijoz F.I.O"
            control={control}
            disabled={!canEdit}
          />
        </FieldGroup>

        <FieldGroup title="Manzil ma'lumotlari">
          <FormField
            name="region"
            label="Viloyat"
            control={control}
            type="select"
            options={regionOptions}
            placeholderOption={true}
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
            dateOptions={{
              maxDate: maxBirthDate,
            }}
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
            disabled
            type="number"
          />
          <FormField
            name="officialSalary"
            label="Rasmiy oylik"
            control={control}
            type="currency"
            disabled={!canEdit}
          />
        </FieldGroup>

        <FieldGroup title="KATM va To'lov ma'lumotlari">
          <FormField
            name="score"
            label="Ball (score)"
            control={control}
            type="number"
            disabled={!canEdit}
          />
          <FormField
            name="katm"
            label="KATM"
            control={control}
            disabled={true}
          />
          <FormField
            name="katmPayment"
            label="KATM to'lov"
            control={control}
            type="currency"
            disabled={!canEdit}
          />
          <FormField
            name="paymentHistory"
            label="To'lov tarixi"
            control={control}
            type="select"
            options={paymentHistoryOptions}
            disabled={!canEdit}
          />
        </FieldGroup>

        <FieldGroup title="MIB va Boshqa ma'lumotlar">
          <FormField
            name="mib"
            label="MIB"
            control={control}
            type="currency"
            disabled={!canEdit}
          />
          <FormField
            name="mibIrresponsible"
            label="MIB mas'uliyatsiz"
            control={control}
            type="select"
            placeholderOption={{ value: false, label: '-' }}
            options={mibIrresponsibleOptions}
            disabled={!canEdit}
          />
          <FormField
            name="aliment"
            label="Aliment"
            control={control}
            type="currency"
            disabled={!canEdit}
          />
        </FieldGroup>

        <FieldGroup title="Yakuniy ma'lumotlar">
          <FormField
            name="finalLimit"
            label="Yakuniy limit"
            control={control}
            type="currency"
            disabled={true}
          />
          <FormField
            name="finalPercentage"
            label="Yakuniy foiz"
            control={control}
            type="number"
            disabled={!canEdit}
          />
          <FormField
            name="acceptedReason"
            label="Qabul qilingan sabab"
            control={control}
            type="select"
            options={acceptedReasonOptions}
            placeholderOption={true}
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
