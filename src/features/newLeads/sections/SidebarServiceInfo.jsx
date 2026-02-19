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

// DateInput outputs 'YYYY-MM-DD'; hooks expect 'DD.MM.YYYY'. This wrapper converts.
function ControlledDateInput({ name, control, disabled }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <DateInput
          value={field.value}
          onChange={(val) =>
            field.onChange(
              val ? moment(val, 'YYYY-MM-DD').format('DD.MM.YYYY') : ''
            )
          }
          disabled={disabled}
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
      <div className="grid grid-cols-2 gap-[10px]">
        <LabeledField label="Umumiy qo'ng'iroqlar soni">
          <Select
            {...register('callCount')}
            disabled={!canEdit}
            className="w-full"
          >
            <SelectOption value="">Tanlang</SelectOption>
            {(callCountOptions ?? []).map((o) => (
              <SelectOption key={o.value} value={o.value}>
                {o.label}
              </SelectOption>
            ))}
          </Select>
        </LabeledField>
        <LabeledField label="Javob berilmagan">
          <Select
            {...register('noAnswerCount')}
            disabled={!canEdit}
            className="w-full"
          >
            <SelectOption value="">Tanlang</SelectOption>
            {(callCountOptions ?? []).map((o) => (
              <SelectOption key={o.value} value={o.value}>
                {o.label}
              </SelectOption>
            ))}
          </Select>
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
        <LabeledField label="Uchrashuv sanasi va vaqti" className="col-span-2">
          <input
            {...register('meetingDate')}
            type="datetime-local"
            disabled={!canEdit}
            className="h-[40px] w-full rounded-[8px] border border-[var(--primary-border-color)] bg-[var(--primary-bg)] px-[12px] text-[14px] text-[var(--primary-color)] outline-none disabled:opacity-50"
          />
        </LabeledField>
        <LabeledField label="Filial">
          <Select
            {...register('branch')}
            disabled={!canEdit}
            className="w-full"
          >
            <SelectOption value="">Tanlang</SelectOption>
            {branchOptions.map((o) => (
              <SelectOption key={o.value} value={o.value}>
                {o.label}
              </SelectOption>
            ))}
          </Select>
        </LabeledField>
        <LabeledField label="Rad etish sababi" className="col-span-2">
          <Select
            {...register('rejectionReason')}
            disabled={!canEdit}
            className="w-full"
          >
            <SelectOption value="">Tanlang</SelectOption>
            {(rejectReasonOptions ?? []).map((o) => (
              <SelectOption key={o.value} value={o.value}>
                {o.label}
              </SelectOption>
            ))}
          </Select>
        </LabeledField>
      </div>
      {canEdit && (
        <Button
          type="submit"
          size="sm"
          className="w-full"
          disabled={!isDirty || isSubmitting}
        >
          {isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
        </Button>
      )}
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
        <LabeledField label="Uchrashuv tasdiqlandi">
          <Select
            {...register('meetingConfirmed', { setValueAs: BOOL_SET_VALUE_AS })}
            disabled={!canEdit}
            className="w-full"
          >
            <SelectOption value="">Tanlang</SelectOption>
            <SelectOption value="true">Ha</SelectOption>
            <SelectOption value="false">Yo'q</SelectOption>
          </Select>
        </LabeledField>
        <LabeledField label="Tasdiqlangan sana" className="col-span-2">
          <ControlledDateInput
            name="meetingConfirmedDate"
            control={control}
            disabled={!canEdit}
          />
        </LabeledField>
        <LabeledField label="Filial">
          <Select
            {...register('branch2')}
            disabled={!canEdit}
            className="w-full"
          >
            <SelectOption value="">Tanlang</SelectOption>
            {(branchOptions ?? []).map((o) => (
              <SelectOption key={o.value} value={o.value}>
                {o.label}
              </SelectOption>
            ))}
          </Select>
        </LabeledField>
        <LabeledField label="Sotuvchi">
          <Select
            {...register('seller')}
            disabled={!canEdit}
            className="w-full"
          >
            <SelectOption value="null">—</SelectOption>
            {(sellerOptions ?? []).map((o) => (
              <SelectOption key={o.value} value={o.value}>
                {o.label}
              </SelectOption>
            ))}
          </Select>
        </LabeledField>
        <LabeledField label="Savdo turi">
          <Select
            {...register('saleType')}
            disabled={!canEdit}
            className="w-full"
          >
            {(sellTypeOptions ?? []).map((o) => (
              <SelectOption key={o.value} value={o.value}>
                {o.label}
              </SelectOption>
            ))}
          </Select>
        </LabeledField>
        <LabeledField label="Xarid amalga oshdimi?">
          <Select
            {...register('purchase', { setValueAs: BOOL_SET_VALUE_AS })}
            disabled={!canEdit}
            className="w-full"
          >
            <SelectOption value="">Tanlang</SelectOption>
            <SelectOption value="true">Ha</SelectOption>
            <SelectOption value="false">Yo'q</SelectOption>
          </Select>
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
          <Select
            {...register('rejectionReason2')}
            disabled={!canEdit}
            className="w-full"
          >
            <SelectOption value="">Tanlang</SelectOption>
            {(rejectReasonOptions ?? []).map((o) => (
              <SelectOption key={o.value} value={o.value}>
                {o.label}
              </SelectOption>
            ))}
          </Select>
        </LabeledField>
      </div>
      {canEdit && (
        <Button
          type="submit"
          size="sm"
          className="w-full"
          disabled={!isDirty || isSubmitting}
        >
          {isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
        </Button>
      )}
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
          <Select
            {...register('paymentHistory')}
            disabled={!canEdit}
            className="w-full"
          >
            <SelectOption value="">Tanlang</SelectOption>
            {paymentHistoryOptions.map((o) => (
              <SelectOption key={o.value} value={o.value}>
                {o.label}
              </SelectOption>
            ))}
          </Select>
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
          <Select
            {...register('acceptedReason')}
            disabled={!canEdit}
            className="w-full"
          >
            <SelectOption value="">Tanlang</SelectOption>
            {acceptedReasonOptions.map((o) => (
              <SelectOption key={o.value} value={o.value}>
                {o.label}
              </SelectOption>
            ))}
          </Select>
        </LabeledField>
      </div>
      {canEdit && (
        <Button
          type="submit"
          size="sm"
          className="w-full"
          disabled={!isDirty || isSubmitting}
        >
          {isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
        </Button>
      )}
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
        {/* Radio group */}
        <div className="flex items-center gap-[16px]">
          {TABS.map(({ key, label }) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-[6px]"
            >
              <input
                type="radio"
                name="serviceTab"
                checked={activeTab === key}
                onChange={() => setActiveTab(key)}
                className="h-[15px] w-[15px] cursor-pointer accent-(--button-bg)"
              />
              <span
                className="text-[13px] font-medium"
                style={{ color: 'var(--primary-color)' }}
              >
                {label}
              </span>
            </label>
          ))}
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
