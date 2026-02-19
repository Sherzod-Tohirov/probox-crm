import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/ui/card';
import { Select, SelectOption } from '@/components/shadcn/ui/select';
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

export default function LeadInfoCard({
  lead,
  executors = [],
  isOperatorManager = false,
  canEditStatus = false,
  onSave,
  onLimitHistoryClick: _onLimitHistoryClick,
}) {
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

  // ---- Unified form ----
  const {
    register,
    reset,
    handleSubmit,
    formState: { isDirty, dirtyFields },
  } = useForm({
    defaultValues: {
      status: lead?.status || '',
      operator: lead?.operator ? String(lead.operator) : '',
      operator2: lead?.operator2 ? String(lead.operator2) : '',
    },
  });

  const [recallModalStatus, setRecallModalStatus] = useState(null);
  const [pendingPayload, setPendingPayload] = useState(null);

  useEffect(() => {
    if (!lead) return;
    reset({
      status: lead?.status || '',
      operator: lead?.operator ? String(lead.operator) : '',
      operator2: lead?.operator2 ? String(lead.operator2) : '',
    });
  }, [lead, reset]);

  const onSubmit = handleSubmit((values) => {
    const payload = {};
    if (canEditStatus && dirtyFields.status) payload.status = values.status;
    if (isOperatorManager && dirtyFields.operator)
      payload.operator = String(values.operator || '');
    if (isOperatorManager && dirtyFields.operator2)
      payload.operator2 = String(values.operator2 || '');
    if (!Object.keys(payload).length) return;

    if (payload.status && RECALL_STATUSES.includes(payload.status)) {
      setPendingPayload(payload);
      setRecallModalStatus(payload.status);
      return;
    }
    onSave?.(payload);
  });

  const handleRecallConfirm = (recallDate) => {
    onSave?.({ ...pendingPayload, recallDate });
    setRecallModalStatus(null);
    setPendingPayload(null);
  };

  const handleRecallClose = () => {
    setRecallModalStatus(null);
    setPendingPayload(null);
    reset({
      status: lead?.status || '',
      operator: lead?.operator ? String(lead.operator) : '',
      operator2: lead?.operator2 ? String(lead.operator2) : '',
    });
  };

  // ---- Executor options ----
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
    <Card>
      <CardHeader>
        <CardTitle>Lead ma'lumotlari</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-[16px]">
        {/* Read-only info row */}
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

        {/* Unified editable form */}
        {hasAnyEdit && (
          <form onSubmit={onSubmit}>
            <div
              className="rounded-[12px] border p-[12px] flex flex-col gap-[10px]"
              style={{
                borderColor: 'var(--primary-border-color)',
                backgroundColor: 'var(--filter-input-bg)',
              }}
            >
              <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2">
                {canEditStatus && (
                  <LabeledField label="Status">
                    <Select {...register('status')} className="w-full">
                      <SelectOption value="">Tanlang</SelectOption>
                      {selectableStatusOptions.map((s) => (
                        <SelectOption key={s.value} value={s.value}>
                          {s.label}
                        </SelectOption>
                      ))}
                    </Select>
                  </LabeledField>
                )}
                {isOperatorManager && (
                  <>
                    <LabeledField label="Operator 1">
                      <Select {...register('operator')} className="w-full">
                        {operator1Options.map((o) => (
                          <SelectOption key={o.value} value={o.value}>
                            {o.label}
                          </SelectOption>
                        ))}
                      </Select>
                    </LabeledField>
                    <LabeledField label="Operator 2">
                      <Select {...register('operator2')} className="w-full">
                        {operator2Options.map((o) => (
                          <SelectOption key={o.value} value={o.value}>
                            {o.label}
                          </SelectOption>
                        ))}
                      </Select>
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

      <FollowUpModal
        isOpen={!!recallModalStatus}
        onClose={handleRecallClose}
        onConfirm={handleRecallConfirm}
        title={modalConfig.title}
        label={modalConfig.label}
        defaultValue={lead?.recallDate || ''}
      />
    </Card>
  );
}
