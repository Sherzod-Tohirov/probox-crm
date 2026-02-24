import {
  useEffect,
  useMemo,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { useForm, Controller as RHFController } from 'react-hook-form';
import { Save } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/ui/card';
import { Select, SelectOption } from '@/components/shadcn/ui/select';
import { Input } from '@/components/shadcn/ui/input';
import { Button } from '@/components/shadcn/ui/button';
import ReadOnlyField from '../components/ReadOnlyField';
import { statusOptions } from '@/features/leads/utils/options';
import FollowUpModal from '@/features/leads/components/modals/FollowUpModal';
import selectOptionsCreator from '@/utils/selectOptionsCreator';
import { findExecutor } from '@/utils/findExecutorById';
import formatDate from '@/utils/formatDate';
import moment from 'moment';

const RECALL_STATUSES = ['FollowUp', 'WillVisitStore', 'WillSendPassport'];

const RECALL_MODAL_CONFIG = {
  FollowUp: {
    title: 'Qayta aloqa sanasini belgilang',
    label: 'Qayta aloqa sanasi va vaqti',
  },
  WillVisitStore: {
    title: "Do'konga borish sanasini belgilang",
    label: "Do'konga borish sanasi va vaqti",
  },
  WillSendPassport: {
    title: 'Passport yuborish sanasini belgilang',
    label: 'Passport yuborish sanasi va vaqti',
  },
};

const REGION_OPTIONS = [
  { value: 'Toshkent shahar', label: 'Toshkent shahar' },
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

function formatPhoneDisplay(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  const local = digits.startsWith('998') ? digits.slice(3) : digits;
  const d = local.slice(0, 9);
  if (!d) return '';
  let result = '+998';
  if (d.length > 0) result += ' ' + d.slice(0, 2);
  if (d.length > 2) result += ' ' + d.slice(2, 5);
  if (d.length > 5) result += ' ' + d.slice(5, 7);
  if (d.length > 7) result += ' ' + d.slice(7, 9);
  return result;
}

function normalizePhoneValue(display) {
  const digits = String(display || '').replace(/\D/g, '');
  if (!digits) return '';
  const local = digits.startsWith('998') ? digits.slice(3) : digits;
  return local ? '998' + local.slice(0, 9) : '';
}

function LabeledField({ label, children }) {
  return (
    <div className="flex flex-col gap-[4px]">
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

function SectionDivider({ title }) {
  return (
    <div className="flex items-center gap-[8px] pt-[4px]">
      <span
        className="shrink-0 text-[11px] font-semibold uppercase tracking-wide"
        style={{ color: 'var(--secondary-color)' }}
      >
        {title}
      </span>
      <div
        className="h-px flex-1"
        style={{ backgroundColor: 'var(--primary-border-color)' }}
      />
    </div>
  );
}

const LeadInfoCard = forwardRef(function LeadInfoCard(
  {
    lead,
    executors = [],
    isOperatorManager = false,
    canEditStatus = false,
    onSave,
    onLimitHistoryClick: _onLimitHistoryClick,
  },
  ref
) {
  const hasAnyEdit = canEditStatus || isOperatorManager;

  const createdAt = lead?.createdAt || lead?.created_at;
  const formattedDate = createdAt
    ? moment(createdAt).format('HH:mm | DD.MM.YYYY')
    : '';
  const formattedRecallDate = formatDate(
    lead?.recallDate,
    'YYYY.MM.DD HH:mm',
    'DD.MM.YYYY HH:mm'
  );

  const buildDefaultValues = (l) => ({
    status: l?.status || '',
    operator: l?.operator ? String(l.operator) : '',
    operator2: l?.operator2 ? String(l.operator2) : '',
    clientFullName: l?.clientFullName || l?.clientName || '',
    clientPhone: l?.clientPhone || '',
    clientPhone2: l?.clientPhone2 || '',
    region: l?.region || '',
    district: l?.district || '',
    neighborhood: l?.neighborhood || '',
    street: l?.street || '',
    house: l?.house || '',
    address2: l?.address2 || '',
  });

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { isDirty },
  } = useForm({ defaultValues: buildDefaultValues(lead) });

  const [recallModalStatus, setRecallModalStatus] = useState(null);
  const [pendingPayload, setPendingPayload] = useState(null);

  useEffect(() => {
    if (!lead) return;
    reset(buildDefaultValues(lead));
  }, [lead, reset]);

  const buildPayload = (values) => ({
    status: values.status,
    operator: String(values.operator || ''),
    operator2: String(values.operator2 || ''),
    clientFullName: String(values.clientFullName || '').trim(),
    clientPhone: String(values.clientPhone || '').trim(),
    clientPhone2: String(values.clientPhone2 || '').trim(),
    region: values.region,
    district: String(values.district || '').trim(),
    neighborhood: String(values.neighborhood || '').trim(),
    street: String(values.street || '').trim(),
    house: String(values.house || '').trim(),
    address2: String(values.address2 || '').trim(),
  });

  const onSubmit = handleSubmit((values) => {
    const payload = buildPayload(values);

    if (payload.status && RECALL_STATUSES.includes(payload.status)) {
      setPendingPayload(payload);
      setRecallModalStatus(payload.status);
      return;
    }
    onSave?.(payload);
  });

  useImperativeHandle(ref, () => ({ submit: onSubmit }), [onSubmit]);

  const handleRecallConfirm = (recallDate) => {
    onSave?.({ ...pendingPayload, recallDate });
    setRecallModalStatus(null);
    setPendingPayload(null);
  };

  const handleRecallClose = () => {
    setRecallModalStatus(null);
    setPendingPayload(null);
    reset(buildDefaultValues(lead));
  };

  const operator1Options = useMemo(
    () =>
      selectOptionsCreator(
        (executors ?? []).filter((e) => String(e.U_role) === 'Operator1'),
        {
          label: 'SlpName',
          value: 'SlpCode',
          includeEmpty: true,
          isEmptySelectable: true,
        }
      ),
    [executors]
  );
  const operator2Options = useMemo(
    () =>
      selectOptionsCreator(
        (executors ?? []).filter((e) => String(e.U_role) === 'Operator2'),
        {
          label: 'SlpName',
          value: 'SlpCode',
          includeEmpty: true,
          isEmptySelectable: true,
        }
      ),
    [executors]
  );

  const operatorName = useMemo(
    () =>
      findExecutor(executors, lead?.operator)?.SlpName || lead?.operator || '—',
    [executors, lead?.operator]
  );
  const operator2Name = useMemo(
    () =>
      findExecutor(executors, lead?.operator2)?.SlpName ||
      lead?.operator2 ||
      '—',
    [executors, lead?.operator2]
  );
  const sellerName = useMemo(
    () => findExecutor(executors, lead?.seller)?.SlpName || lead?.seller || '—',
    [executors, lead?.seller]
  );
  const scoringName = useMemo(
    () =>
      findExecutor(executors, lead?.scoring)?.SlpName || lead?.scoring || '—',
    [executors, lead?.scoring]
  );

  const statusLabel =
    statusOptions?.find((s) => s.value === lead?.status)?.label ||
    lead?.status ||
    '';

  const selectableStatusOptions = useMemo(
    () =>
      statusOptions.filter(
        (s) => !s.isNotSelectable || s.value === lead?.status
      ),
    [lead?.status]
  );

  const modalConfig = RECALL_MODAL_CONFIG[recallModalStatus] || {};

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lead ma'lumotlari</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-[16px]">
          {/* Read-only meta row */}
          <div className="grid grid-cols-2 gap-[12px] sm:grid-cols-4">
            <ReadOnlyField
              label="Holat"
              value={lead?.isBlocked ? 'Bloklangan' : 'Ochiq'}
            />
            <ReadOnlyField label="Status" value={statusLabel} />
            <ReadOnlyField label="Manba" value={lead?.source} />
            <ReadOnlyField label="Yaratilgan vaqt" value={formattedDate} />
          </div>

          {/* Executor names row */}
          <div className="grid grid-cols-2 gap-[12px] sm:grid-cols-4">
            <ReadOnlyField label="Operator 1" value={operatorName} />
            <ReadOnlyField label="Operator 2" value={operator2Name} />
            <ReadOnlyField label="Sotuvchi" value={sellerName} />
            <ReadOnlyField label="Skoring" value={scoringName} />
          </div>

          {formattedRecallDate ? (
            <div className="grid grid-cols-2 gap-[12px] sm:grid-cols-4">
              <ReadOnlyField
                label="Qayta aloqa vaqti"
                value={formattedRecallDate}
              />
            </div>
          ) : null}

          {/* Editable form */}
          {hasAnyEdit && (
            <form id="lead-info-form" onSubmit={onSubmit}>
              <div
                className="flex flex-col gap-[14px] rounded-[12px] border p-[14px]"
                style={{
                  borderColor: 'var(--primary-border-color)',
                  backgroundColor: 'var(--filter-input-bg)',
                }}
              >
                {/* ── Mijoz ma'lumotlari ── */}
                <SectionDivider title="Mijoz ma'lumotlari" />
                <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2 lg:grid-cols-3">
                  <LabeledField label="F.I.O">
                    <Input
                      type="text"
                      placeholder="Ism familiya"
                      {...register('clientFullName')}
                    />
                  </LabeledField>

                  <LabeledField label="Telefon raqam 1">
                    <RHFController
                      name="clientPhone"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="tel"
                          inputMode="numeric"
                          placeholder="+998 XX XXX XX XX"
                          value={formatPhoneDisplay(field.value)}
                          onChange={(e) =>
                            field.onChange(normalizePhoneValue(e.target.value))
                          }
                        />
                      )}
                    />
                  </LabeledField>

                  <LabeledField label="Telefon raqam 2">
                    <RHFController
                      name="clientPhone2"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="tel"
                          inputMode="numeric"
                          placeholder="+998 XX XXX XX XX"
                          value={formatPhoneDisplay(field.value)}
                          onChange={(e) =>
                            field.onChange(normalizePhoneValue(e.target.value))
                          }
                        />
                      )}
                    />
                  </LabeledField>
                </div>

                {/* ── Manzil ── */}
                <SectionDivider title="Manzil ma'lumotlari" />
                <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2 lg:grid-cols-3">
                  <LabeledField label="Viloyat">
                    <RHFController
                      name="region"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onChange={field.onChange}
                          className="w-full"
                        >
                          <SelectOption value="">Tanlang</SelectOption>
                          {REGION_OPTIONS.map((r) => (
                            <SelectOption key={r.value} value={r.value}>
                              {r.label}
                            </SelectOption>
                          ))}
                        </Select>
                      )}
                    />
                  </LabeledField>

                  <LabeledField label="Tuman">
                    <Input
                      type="text"
                      placeholder="Tuman"
                      {...register('district')}
                    />
                  </LabeledField>

                  <LabeledField label="Mahalla">
                    <Input
                      type="text"
                      placeholder="Mahalla"
                      {...register('neighborhood')}
                    />
                  </LabeledField>

                  <LabeledField label="Ko'cha">
                    <Input
                      type="text"
                      placeholder="Ko'cha"
                      {...register('street')}
                    />
                  </LabeledField>

                  <LabeledField label="Uy">
                    <Input
                      type="text"
                      placeholder="Uy raqami"
                      {...register('house')}
                    />
                  </LabeledField>

                  <LabeledField label="Qo'shimcha manzil">
                    <Input
                      type="text"
                      placeholder="Qo'shimcha manzil"
                      {...register('address2')}
                    />
                  </LabeledField>
                </div>

                {/* ── Status / Operators ── */}
                <SectionDivider title="Status va operatorlar" />
                <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2 lg:grid-cols-3">
                  {canEditStatus && (
                    <LabeledField label="Status">
                      <RHFController
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={field.onChange}
                            className="w-full"
                          >
                            <SelectOption value="">Tanlang</SelectOption>
                            {selectableStatusOptions.map((s) => (
                              <SelectOption key={s.value} value={s.value}>
                                {s.label}
                              </SelectOption>
                            ))}
                          </Select>
                        )}
                      />
                    </LabeledField>
                  )}
                  {isOperatorManager && (
                    <>
                      <LabeledField label="Operator">
                        <RHFController
                          name="operator"
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onChange={field.onChange}
                              className="w-full"
                            >
                              {operator1Options.map((o) => (
                                <SelectOption key={o.value} value={o.value}>
                                  {o.label}
                                </SelectOption>
                              ))}
                            </Select>
                          )}
                        />
                      </LabeledField>
                    </>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!isDirty}
                    className="flex items-center gap-[6px]"
                  >
                    <Save size={14} />
                    Saqlash
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <FollowUpModal
        isOpen={!!recallModalStatus}
        onClose={handleRecallClose}
        onConfirm={handleRecallConfirm}
        title={modalConfig.title}
        label={modalConfig.label}
        defaultValue={lead?.recallDate || ''}
      />
    </>
  );
});

export default LeadInfoCard;
