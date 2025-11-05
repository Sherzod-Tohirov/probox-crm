import { useEffect, useState } from 'react';
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
import moment from 'moment';

// Address fields moved to General Information in LeadPage

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
  const [limitStatus, setLimitStatus] = useState('');

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
  const formatBirthDate = (birthDate) => {
    if (!birthDate) return '';
    const parsed = moment(
      birthDate,
      ['DD.MM.YYYY', 'YYYY.MM.DD', moment.ISO_8601],
      true
    );
    const validMoment = parsed.isValid() ? parsed : moment(birthDate);
    return validMoment.isValid() ? validMoment.format('DD.MM.YYYY') : '';
  };
  useEffect(() => {
    if (!form) return;
    if (leadData) {
      const isNotFalsy = (value) => {
        return value === undefined || value === null || value === false
          ? ''
          : value;
      };
      reset({
        clientFullName: leadData.clientFullName,
        birthDate: formatBirthDate(leadData.birthDate),
        applicationDate: leadData.applicationDate,
        age: leadData.age,
        score: leadData.score,
        katm: isNotFalsy(leadData.katm),
        katmPayment: isNotFalsy(leadData.katmPayment),
        paymentHistory: isNotFalsy(leadData.paymentHistory),
        mib: isNotFalsy(leadData.mib),
        mibIrresponsible: leadData.mibIrresponsible,
        aliment: isNotFalsy(leadData.aliment),
        officialSalary: isNotFalsy(leadData.officialSalary),
        finalLimit: isNotFalsy(leadData.finalLimit),
        finalPercentage: isNotFalsy(leadData.finalPercentage),
        acceptedReason: isNotFalsy(leadData.acceptedReason),
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
      const birthDate = Array.isArray(fieldBirthDate)
        ? fieldBirthDate[0]
        : fieldBirthDate;
      setValue('age', getAge(birthDate), { shouldValidate: true });
    }
  }, [fieldBirthDate, setValue, form]);
  useEffect(() => {
    if (!form) return;
    const isProvided = (value) => {
      if (typeof value === 'boolean') return true;
      if (typeof value === 'number') return !Number.isNaN(value);
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== '';
    };
    const allProvided =
      isProvided(fieldAge) &&
      isProvided(fieldKatm) &&
      isProvided(fieldKatmPayment) &&
      isProvided(fieldPaymentHistory) &&
      isProvided(fieldMib) &&
      isProvided(fieldMibIrresponsible) &&
      isProvided(fieldAliment) &&
      isProvided(fieldOfficialSalary);
    const providedAny =
      isProvided(fieldAge) ||
      isProvided(fieldKatm) ||
      isProvided(fieldKatmPayment) ||
      isProvided(fieldPaymentHistory) ||
      isProvided(fieldMib) ||
      isProvided(fieldMibIrresponsible) ||
      isProvided(fieldAliment) ||
      isProvided(fieldOfficialSalary);
    if (!providedAny) {
      setLimitStatus('not_provided');
      setValue('finalLimit', '', { shouldValidate: true });
      return;
    }
    if (!allProvided) {
      setLimitStatus('in_progress');
      setValue('finalLimit', '', { shouldValidate: true });
      return;
    }

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
    if (!computed || computed <= 0) {
      setLimitStatus('no_limit');
    } else {
      setLimitStatus('has_limit');
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
  useEffect(() => {
    if (!form) return;
    if (fieldBirthDate) {
      setValue('applicationDate', new Date());
    }
  }, [fieldBirthDate, setValue, form]);

  const acceptedReasonOptions = [
    { value: 'Yaxshi mijoz', label: 'Yaxshi mijoz' },
    { value: 'Unduruv ruxsat bergan', label: 'Undruv ruxsat bergan' },
    { value: 'Limit chiqdi', label: 'Limit chiqdi' },
  ];

  const getLimitText = (status) => {
    switch (status) {
      case 'in_progress':
        return 'Jarayonda';
      case 'no_limit':
        return 'Limit chiqmadi';
      case 'has_limit':
        return 'Limit chiqdi';
      default:
        return '';
    }
  };

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

        {/* Address fields are edited in General Information section */}

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
            disabled={true}
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
            placeholderOption={{ value: null, label: '-' }}
            disabled={!canEdit}
          />
          <FormField
            name="paymentHistory"
            label="To'lov tarixi"
            control={control}
            type="select"
            options={paymentHistoryOptions}
            placeholderOption={true}
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
          <Row>
            <span
              style={{
                fontSize: '3.5rem',
                fontWeight: 600,
                color:
                  limitStatus === 'in_progress'
                    ? 'var(--info-color)'
                    : limitStatus === 'no_limit'
                      ? 'var(--danger-color)'
                      : 'var(--success-color)',
              }}
            >
              {getLimitText(limitStatus)}
            </span>
          </Row>
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
