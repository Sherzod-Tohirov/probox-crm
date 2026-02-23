import { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/ui/card';
import { Select, SelectOption } from '@/components/shadcn/ui/select';
import { Input } from '@/components/shadcn/ui/input';
import { Button } from '@/components/shadcn/ui/button';
import { DateInput } from '@/components/shadcn/ui/date-input';
import useAuth from '@hooks/useAuth';
import useOperator1Form from '@/features/leads/hooks/useOperator1Form';
import useSellerForm from '@/features/leads/hooks/useSellerForm';
import useScoringForm from '@/features/leads/hooks/useScoringForm';
import { useSelectOptions } from '@/features/leads/hooks/useSelectOptions';
import useFetchBranches from '@/hooks/data/useFetchBranches';
import { normalizeDate } from '@/features/leads/utils/date';
import moment from 'moment';

const TABS = [
  { key: 'operator', label: 'Operator' },
  { key: 'seller', label: 'Sotuvchi' },
  { key: 'scoring', label: 'Tekshiruv' },
];

const TAB_TO_ROLE = {
  operator: ['Operator1', 'OperatorM'],
  seller: ['Seller'],
  scoring: ['Scoring'],
};

const ROLE_TO_TAB = {
  Operator1: 'operator',
  OperatorM: 'operator',
  Seller: 'seller',
  Scoring: 'scoring',
};

function canEditTabRole(userRole, tabKey) {
  return (TAB_TO_ROLE[tabKey] ?? []).includes(userRole);
}

function ControlledSelect({
  name,
  control,
  disabled,
  className,
  children,
  setValueAs,
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          value={field.value ?? ''}
          onChange={(val) => field.onChange(setValueAs ? setValueAs(val) : val)}
          disabled={disabled}
          className={className ?? 'w-full'}
        >
          {children}
        </Select>
      )}
    />
  );
}

function ControlledDateInput({ name, control, disabled, withTime = false }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <DateInput
          value={field.value}
          onChange={(val) => field.onChange(val ?? '')}
          disabled={disabled}
          withTime={withTime}
          className="w-full"
        />
      )}
    />
  );
}

function LabeledField({ label, children, className }) {
  return (
    <div
      className={`flex w-full flex-col gap-[4px]${className ? ' ' + className : ''}`}
    >
      <span
        className="text-[12px] font-medium"
        style={{ color: 'var(--secondary-color)' }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function OperatorFields({ leadId, leadData, canEdit }) {
  const { form, handleSubmit, isSubmitting } = useOperator1Form(
    leadId,
    leadData
  );
  const {
    register,
    control,
    reset,
    formState: { isDirty },
  } = form;
  const { data: branches } = useFetchBranches();
  const { callCountOptions, rejectReasonOptions } = {
    ...useSelectOptions('operator1'),
    ...useSelectOptions('common'),
  };

  useEffect(() => {
    if (leadData) {
      reset({
        called: leadData.called ?? false,
        callTime: leadData.callTime ?? '',
        answered: leadData.answered ?? false,
        noAnswerCount: leadData.noAnswerCount ?? '',
        callCount: leadData.callCount ?? '',
        interested: leadData.interested ?? '',
        rejectionReason: leadData.rejectionReason ?? '',
        jshshir: leadData.jshshir ?? '',
        passportId: leadData.passportId ?? '',
        meetingHappened: leadData.meetingHappened ?? false,
        meetingDate: normalizeDate(leadData.meetingDate),
        branch: leadData.branch ?? '',
      });
    }
  }, [leadData, reset]);

  const branchOptions = (branches ?? []).map((b) => ({
    value: b._id || b.id,
    label: b.name,
  }));
  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-[12px]">
      {/* Toggle row: called / answered / interested */}
      <div className="grid grid-cols-3 gap-[6px]">
        <Controller
          name="called"
          control={control}
          render={({ field }) => (
            <button
              type="button"
              disabled={!canEdit}
              onClick={() => field.onChange(!field.value)}
              className="flex flex-col items-center gap-[4px] rounded-[10px] border px-[8px] py-[8px] transition-all disabled:opacity-50"
              style={
                field.value
                  ? {
                      backgroundColor: 'var(--button-bg)',
                      borderColor: 'var(--button-bg)',
                      color: 'var(--button-color)',
                    }
                  : {
                      backgroundColor: 'var(--primary-input-bg)',
                      borderColor: 'var(--primary-border-color)',
                      color: 'var(--secondary-color)',
                    }
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              <span className="text-[11px] font-semibold">Qo'ng'iroq</span>
            </button>
          )}
        />
        <Controller
          name="answered"
          control={control}
          render={({ field }) => (
            <button
              type="button"
              disabled={!canEdit}
              onClick={() => field.onChange(!field.value)}
              className="flex flex-col items-center gap-[4px] rounded-[10px] border px-[8px] py-[8px] transition-all disabled:opacity-50"
              style={
                field.value
                  ? {
                      backgroundColor: 'var(--success-color)',
                      borderColor: 'var(--success-color)',
                      color: '#fff',
                    }
                  : {
                      backgroundColor: 'var(--primary-input-bg)',
                      borderColor: 'var(--primary-border-color)',
                      color: 'var(--secondary-color)',
                    }
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-[11px] font-semibold">Javob berdi</span>
            </button>
          )}
        />
        <Controller
          name="interested"
          control={control}
          render={({ field }) => {
            const isActive = field.value === true || field.value === 'true';
            return (
              <button
                type="button"
                disabled={!canEdit}
                onClick={() => field.onChange(isActive ? '' : true)}
                className="flex flex-col items-center gap-[4px] rounded-[10px] border px-[8px] py-[8px] transition-all disabled:opacity-50"
                style={
                  isActive
                    ? {
                        backgroundColor: 'var(--warning-color)',
                        borderColor: 'var(--warning-color)',
                        color: '#fff',
                      }
                    : {
                        backgroundColor: 'var(--primary-input-bg)',
                        borderColor: 'var(--primary-border-color)',
                        color: 'var(--secondary-color)',
                      }
                }
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
                <span className="text-[11px] font-semibold">Qiziqdi</span>
              </button>
            );
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-[10px]">
        <LabeledField label="Umumiy qo'ng'iroqlar">
          <ControlledSelect
            name="callCount"
            control={control}
            disabled={!canEdit}
          >
            <SelectOption value="">Tanlang</SelectOption>
            {(callCountOptions ?? []).map((o) => (
              <SelectOption key={o.value} value={o.value}>
                {o.label}
              </SelectOption>
            ))}
          </ControlledSelect>
        </LabeledField>
        <LabeledField label="Javob berilmagan">
          <ControlledSelect
            name="noAnswerCount"
            control={control}
            disabled={!canEdit}
          >
            <SelectOption value="">Tanlang</SelectOption>
            {(callCountOptions ?? []).map((o) => (
              <SelectOption key={o.value} value={o.value}>
                {o.label}
              </SelectOption>
            ))}
          </ControlledSelect>
        </LabeledField>
        <LabeledField label="JSHSHIR" className="col-span-2">
          <Input
            {...register('jshshir')}
            disabled={!canEdit}
            className="w-full"
            placeholder="—"
          />
        </LabeledField>
        <LabeledField label="Passport ID" className="col-span-2">
          <Input
            {...register('passportId')}
            disabled={!canEdit}
            className="w-full"
            placeholder="—"
          />
        </LabeledField>
        <LabeledField label="Uchrashuv sanasi va vaqti" className="col-span-2">
          <ControlledDateInput
            name="meetingDate"
            control={control}
            disabled={!canEdit}
            withTime
          />
        </LabeledField>
        <LabeledField label="Filial" className="col-span-2">
          <ControlledSelect name="branch" control={control} disabled={!canEdit}>
            <SelectOption value="">Tanlang</SelectOption>
            {branchOptions.map((o) => (
              <SelectOption key={o.value} value={o.value}>
                {o.label}
              </SelectOption>
            ))}
          </ControlledSelect>
        </LabeledField>
        <LabeledField label="Rad etish sababi" className="col-span-2">
          <ControlledSelect
            name="rejectionReason"
            control={control}
            disabled={!canEdit}
          >
            <SelectOption value="">Tanlang</SelectOption>
            {(rejectReasonOptions ?? []).map((o) => (
              <SelectOption key={o.value} value={o.value}>
                {o.label}
              </SelectOption>
            ))}
          </ControlledSelect>
        </LabeledField>
      </div>
      <Button
        type="submit"
        size="sm"
        className="w-full"
        disabled={!canEdit || !isDirty || isSubmitting}
      >
        {isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
      </Button>
    </form>
  );
}

const BOOL_SET_VALUE_AS = (v) => {
  if (v === 'true') return true;
  if (v === 'false') return false;
  return v;
};

function SellerFields({ leadId, leadData, canEdit }) {
  const { form, handleSubmit, isSubmitting } = useSellerForm(leadId, leadData);
  const {
    register,
    control,
    reset,
    formState: { isDirty },
  } = form;
  const { sellerOptions, sellTypeOptions, branchOptions } =
    useSelectOptions('seller');
  const { rejectReasonOptions } = useSelectOptions('common');

  useEffect(() => {
    if (leadData) {
      reset({
        meetingConfirmed: leadData.meetingConfirmed || false,
        meetingConfirmedDate: leadData.meetingConfirmedDate
          ? moment(leadData.meetingConfirmedDate, 'YYYY.MM.DD').format(
              'DD.MM.YYYY'
            )
          : '',
        branch2: leadData.branch2 ?? '',
        seller: leadData.seller === null ? 'null' : (leadData.seller ?? ''),
        purchase: leadData.purchase || false,
        rejectionReason2: leadData.rejectionReason2 || '',
        purchaseDate: leadData.purchaseDate
          ? moment(leadData.purchaseDate, 'YYYY.MM.DD').format('DD.MM.YYYY')
          : '',
        saleType: leadData.saleType || '',
        passportId: leadData.passportId || '',
        jshshir: leadData.jshshir || '',
        conditionFilter: 'all',
        searchBranchFilter: 'all',
      });
    }
  }, [leadData, reset]);

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-[12px]">
      <div className="grid grid-cols-2 gap-[10px]">
        <LabeledField label="Uchrashuv tasdiqlandi" className="col-span-2">
          <ControlledSelect
            name="meetingConfirmed"
            control={control}
            disabled={!canEdit}
            setValueAs={BOOL_SET_VALUE_AS}
          >
            <SelectOption value="">Tanlang</SelectOption>
            <SelectOption value="true">Ha</SelectOption>
            <SelectOption value="false">Yo'q</SelectOption>
          </ControlledSelect>
        </LabeledField>
        <LabeledField label="Tasdiqlangan sana" className="col-span-2">
          <ControlledDateInput
            name="meetingConfirmedDate"
            control={control}
            disabled={!canEdit}
          />
        </LabeledField>
        <LabeledField label="Filial">
          <ControlledSelect
            name="branch2"
            control={control}
            disabled={!canEdit}
          >
            <SelectOption value="">Tanlang</SelectOption>
            {(branchOptions ?? []).map((o) => (
              <SelectOption key={o.value} value={o.value}>
                {o.label}
              </SelectOption>
            ))}
          </ControlledSelect>
        </LabeledField>
        <LabeledField label="Sotuvchi">
          <ControlledSelect name="seller" control={control} disabled={!canEdit}>
            <SelectOption value="null">—</SelectOption>
            {(sellerOptions ?? []).map((o) => (
              <SelectOption key={o.value} value={o.value}>
                {o.label}
              </SelectOption>
            ))}
          </ControlledSelect>
        </LabeledField>
        <LabeledField label="Savdo turi">
          <ControlledSelect
            name="saleType"
            control={control}
            disabled={!canEdit}
          >
            {(sellTypeOptions ?? []).map((o) => (
              <SelectOption key={o.value} value={o.value}>
                {o.label}
              </SelectOption>
            ))}
          </ControlledSelect>
        </LabeledField>
        <LabeledField label="Xarid amalga oshdimi?">
          <ControlledSelect
            name="purchase"
            control={control}
            disabled={!canEdit}
            setValueAs={BOOL_SET_VALUE_AS}
          >
            <SelectOption value="">Tanlang</SelectOption>
            <SelectOption value="true">Ha</SelectOption>
            <SelectOption value="false">Yo'q</SelectOption>
          </ControlledSelect>
        </LabeledField>
        <LabeledField label="Xarid sanasi" className="col-span-2">
          <ControlledDateInput
            name="purchaseDate"
            control={control}
            disabled={!canEdit}
          />
        </LabeledField>
        <LabeledField label="JSHSHIR">
          <Input
            {...register('jshshir')}
            disabled={!canEdit}
            className="w-full"
            placeholder="—"
          />
        </LabeledField>
        <LabeledField label="Passport ID">
          <Input
            {...register('passportId')}
            disabled={!canEdit}
            className="w-full"
            placeholder="—"
          />
        </LabeledField>
        <LabeledField label="Rad etish sababi" className="col-span-2">
          <ControlledSelect
            name="rejectionReason2"
            control={control}
            disabled={!canEdit}
          >
            <SelectOption value="">Tanlang</SelectOption>
            {(rejectReasonOptions ?? []).map((o) => (
              <SelectOption key={o.value} value={o.value}>
                {o.label}
              </SelectOption>
            ))}
          </ControlledSelect>
        </LabeledField>
      </div>
      <Button
        type="submit"
        size="sm"
        className="w-full"
        disabled={!canEdit || !isDirty || isSubmitting}
      >
        {isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
      </Button>
    </form>
  );
}

function ScoringFields({ leadId, leadData, canEdit }) {
  const { form, handleSubmit, isSubmitting } = useScoringForm(leadId, leadData);
  const {
    register,
    control,
    reset,
    formState: { isDirty },
  } = form;

  useEffect(() => {
    if (leadData) {
      reset({
        clientFullName: leadData.clientFullName || '',
        birthDate: leadData.birthDate
          ? moment(
              leadData.birthDate,
              ['DD.MM.YYYY', 'YYYY.MM.DD', moment.ISO_8601],
              true
            ).format('DD.MM.YYYY')
          : '',
        age: leadData.age ?? '',
        score: leadData.score ?? '',
        katm: leadData.katm ?? '',
        katmPayment: leadData.katmPayment ?? '',
        paymentHistory: leadData.paymentHistory || '',
        mib: leadData.mib ?? '',
        mibIrresponsible: leadData.mibIrresponsible ?? '',
        aliment: leadData.aliment ?? '',
        officialSalary: leadData.officialSalary ?? '',
        finalLimit: leadData.finalLimit ?? '',
        finalPercentage: leadData.finalPercentage ?? '',
        acceptedReason: leadData.acceptedReason || '',
      });
    }
  }, [leadData, reset]);

  const paymentHistoryOptions = [
    { value: '0 Kun', label: '0 Kun' },
    { value: '30 kun AQ', label: '30 kun AQ' },
    { value: 'Keyinga oy AQ', label: 'Keyinga oy AQ' },
    { value: '31-60 kun AQ', label: '31-60 kun AQ' },
    { value: '61-90 kun AQ', label: '61-90 kun AQ' },
    { value: '91 kun AQ', label: '91 kun AQ' },
    { value: 'SUD', label: 'SUD' },
  ];

  const acceptedReasonOptions = [
    { value: 'Yaxshi mijoz', label: 'Yaxshi mijoz' },
    { value: 'Unduruv ruxsat bergan', label: 'Unduruv ruxsat bergan' },
    { value: 'Limit chiqdi', label: 'Limit chiqdi' },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-[12px]">
      <div className="grid grid-cols-2 gap-[10px]">
        <LabeledField label="Mijoz F.I.O" className="col-span-2">
          <Input
            {...register('clientFullName')}
            disabled={!canEdit}
            className="w-full"
            placeholder="—"
          />
        </LabeledField>
        <LabeledField label="Tug'ilgan sana" className="col-span-2">
          <ControlledDateInput
            name="birthDate"
            control={control}
            disabled={!canEdit}
          />
        </LabeledField>
        <LabeledField label="Ball (score)">
          <Input
            type="number"
            {...register('score')}
            disabled={!canEdit}
            className="w-full"
            placeholder="—"
          />
        </LabeledField>
        <LabeledField label="KATM to'lov">
          <Input
            {...register('katmPayment')}
            disabled={!canEdit}
            className="w-full"
            placeholder="—"
          />
        </LabeledField>
        <LabeledField label="To'lov tarixi">
          <ControlledSelect
            name="paymentHistory"
            control={control}
            disabled={!canEdit}
          >
            <SelectOption value="">Tanlang</SelectOption>
            {paymentHistoryOptions.map((o) => (
              <SelectOption key={o.value} value={o.value}>
                {o.label}
              </SelectOption>
            ))}
          </ControlledSelect>
        </LabeledField>
        <LabeledField label="Rasmiy oylik">
          <Input
            {...register('officialSalary')}
            disabled={!canEdit}
            className="w-full"
            placeholder="—"
          />
        </LabeledField>
        <LabeledField label="MIB">
          <Input
            {...register('mib')}
            disabled={!canEdit}
            className="w-full"
            placeholder="—"
          />
        </LabeledField>
        <LabeledField label="Aliment">
          <Input
            {...register('aliment')}
            disabled={!canEdit}
            className="w-full"
            placeholder="—"
          />
        </LabeledField>
        <LabeledField label="Yakuniy foiz">
          <Input
            type="number"
            {...register('finalPercentage')}
            disabled={!canEdit}
            className="w-full"
            placeholder="—"
          />
        </LabeledField>
        <LabeledField label="Qabul qilingan sabab" className="col-span-2">
          <ControlledSelect
            name="acceptedReason"
            control={control}
            disabled={!canEdit}
          >
            <SelectOption value="">Tanlang</SelectOption>
            {acceptedReasonOptions.map((o) => (
              <SelectOption key={o.value} value={o.value}>
                {o.label}
              </SelectOption>
            ))}
          </ControlledSelect>
        </LabeledField>
      </div>
      <Button
        type="submit"
        size="sm"
        className="w-full"
        disabled={!canEdit || !isDirty || isSubmitting}
      >
        {isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
      </Button>
    </form>
  );
}

export default function SidebarServiceInfo({ lead, leadId }) {
  const { user } = useAuth();
  const userRole = user?.U_role || user?.role;

  const canEditOperator = canEditTabRole(userRole, 'operator');
  const canEditSeller = canEditTabRole(userRole, 'seller');
  const canEditScoring = canEditTabRole(userRole, 'scoring');

  const defaultTab = ROLE_TO_TAB[userRole] ?? 'operator';

  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Xizmat ma'lumotlari</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-[16px]">
        {/* Radio-style tab group */}
        <div className="flex items-center gap-[6px]">
          {TABS.map(({ key, label }) => {
            const isActive = activeTab === key;
            return (
              <label
                key={key}
                className="flex flex-1 cursor-pointer items-center justify-center gap-[6px] rounded-[8px] px-[10px] py-[7px] transition-all"
                style={
                  isActive
                    ? {
                        backgroundColor: 'var(--button-bg)',
                        color: 'var(--button-color)',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
                      }
                    : {
                        backgroundColor: 'var(--primary-input-bg)',
                        color: 'var(--secondary-color)',
                        border: '1px solid var(--primary-border-color)',
                      }
                }
              >
                <input
                  type="radio"
                  name="serviceTab"
                  value={key}
                  checked={isActive}
                  onChange={() => setActiveTab(key)}
                  className="sr-only"
                />
                {/* Custom radio circle */}
                <span
                  className="flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full border-[2px] transition-all"
                  style={
                    isActive
                      ? {
                          borderColor: 'var(--button-color)',
                          backgroundColor: 'transparent',
                        }
                      : {
                          borderColor: 'var(--secondary-color)',
                          backgroundColor: 'transparent',
                        }
                  }
                >
                  {isActive && (
                    <span
                      className="h-[6px] w-[6px] rounded-full"
                      style={{ backgroundColor: 'var(--button-color)' }}
                    />
                  )}
                </span>
                <span className="text-[12px] font-semibold">{label}</span>
              </label>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTab === 'operator' && (
          <OperatorFields
            leadId={leadId}
            leadData={lead}
            canEdit={canEditOperator}
          />
        )}
        {activeTab === 'seller' && (
          <SellerFields
            leadId={leadId}
            leadData={lead}
            canEdit={canEditSeller}
          />
        )}
        {activeTab === 'scoring' && (
          <ScoringFields
            leadId={leadId}
            leadData={lead}
            canEdit={canEditScoring}
          />
        )}
      </CardContent>
    </Card>
  );
}
