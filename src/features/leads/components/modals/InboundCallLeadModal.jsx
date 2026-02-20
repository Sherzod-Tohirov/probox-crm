import { Controller, useForm } from 'react-hook-form';
import { useCallback, useEffect, useRef, useState } from 'react';

import useAuth from '@hooks/useAuth';
import useAlert from '@hooks/useAlert';
import useFetchMessages from '@hooks/data/useFetchMessages';
import useMessengerActions from '@hooks/useMessengerActions';
import useMutateLead from '@/hooks/data/leads/useMutateLead';
import FollowUpModal from '@/features/leads/components/modals/FollowUpModal';
import formatDate from '@/utils/formatDate';
import { statusOptions } from '@/features/leads/utils/options';
import { Messenger } from '@/components/shadcn/ui/messenger';
import { Modal } from '@components/ui';
import { Button } from '@/components/shadcn/ui/button';
import { Input } from '@/components/shadcn/ui/input';
import { Select, SelectOption } from '@/components/shadcn/ui/select';
import { useSelectOptions } from '../../hooks/useSelectOptions';
import { useNavigate } from 'react-router-dom';
import { Link } from 'lucide-react';

const INBOUND_CALL_EVENT = 'probox:inbound-call';

const RECALL_MODAL_CONFIG = {
  FollowUp: {
    title: 'Qayta aloqa sanasini belgilang',
    label: 'Qayta aloqa sanasi va vaqti',
  },
  WillVisitStore: {
    title: "Do'konga borish sanasi belgilash",
    label: "Do'konga borish sanasi va vaqti",
  },
  WillSendPassport: {
    title: 'Passport yuborish sanasini belgilang',
    label: 'Passport yuborish sanasi va vaqti',
  },
};

const DEFAULT_FORM_VALUES = {
  clientFullName: '',
  clientPhone: '',
  status: '',
  rejectionReason: '',
  jshshir: '',
  passportId: '',
  recallDate: '',
};

function firstDefined(source, keys) {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }
  return '';
}

function normalizeInboundCallPayload(rawRecord) {
  const merged = {
    ...(rawRecord?.lead && typeof rawRecord.lead === 'object'
      ? rawRecord.lead
      : {}),
    ...(rawRecord || {}),
  };

  const leadId = firstDefined(merged, [
    'leadId',
    'leadID',
    'LeadId',
    'id',
    '_id',
  ]);

  return {
    leadId: leadId ? String(leadId) : '',
    SlpCode: firstDefined(merged, ['SlpCode', 'slpCode']),
    operator: firstDefined(merged, ['operator', 'Operator']),
    operator2: firstDefined(merged, ['operator2', 'Operator2']),
    clientFullName: String(
      firstDefined(merged, ['clientFullName', 'clientName', 'name']) || ''
    ),
    clientPhone: String(firstDefined(merged, ['clientPhone', 'phone']) || ''),
    status: String(firstDefined(merged, ['status']) || ''),
    rejectionReason: String(
      firstDefined(merged, [
        'rejectionReason',
        'rejectReason',
        'rejectedReason',
        'rejection_reason',
      ]) || ''
    ),
    jshshir: String(firstDefined(merged, ['jshshir']) || ''),
    passportId: String(
      firstDefined(merged, ['passportId', 'passportID']) || ''
    ).toUpperCase(),
  };
}

function belongsToCurrentUser(record, user) {
  if (!record || !user) return false;

  const userCode = String(user?.SlpCode ?? '');
  if (!userCode) return false;

  if (record?.SlpCode !== undefined && record?.SlpCode !== null) {
    return String(record.SlpCode) === userCode;
  }

  if (record?.operator !== undefined && record?.operator !== null) {
    if (String(record.operator) === userCode) return true;
  }

  if (record?.operator2 !== undefined && record?.operator2 !== null) {
    if (String(record.operator2) === userCode) return true;
  }

  return false;
}

function formatPhoneDisplay(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  // Strip leading 998 prefix to work with the 9-digit local number
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

function FormField({ label, children }) {
  return (
    <div className="flex flex-col gap-[6px]">
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

export default function InboundCallLeadModal() {
  const { user } = useAuth();
  const { alert } = useAlert();
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);
  const [inboundLead, setInboundLead] = useState(null);
  const [recallModalStatus, setRecallModalStatus] = useState(null);
  const lastInboundRef = useRef({ key: '', at: 0 });
  const { rejectReasonOptions } = useSelectOptions('common');
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = useForm({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const leadId = inboundLead?.leadId || '';

  const updateLead = useMutateLead(leadId);

  const {
    data: messages,
    isLoading: isMessagesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchMessages({
    entityType: 'lead',
    entityId: leadId,
    enabled: Boolean(isOpen && leadId),
  });

  const { sendMessage, editMessage, deleteMessage } = useMessengerActions({
    entityType: 'lead',
    entityId: leadId,
  });

  const handleClose = useCallback(() => {
    setOpen(false);
    setInboundLead(null);
    setRecallModalStatus(null);
    reset(DEFAULT_FORM_VALUES);
  }, [reset]);

  const saveLeadPayload = useCallback(
    (values, recallDate) => {
      const payload = {
        clientFullName: String(values?.clientFullName || '').trim(),
        clientPhone: String(values?.clientPhone || '').trim(),
        status: String(values?.status || '').trim(),
        rejectionReason: String(values?.rejectionReason || '').trim(),
        jshshir: String(values?.jshshir || '').trim(),
        passportId: String(values?.passportId || '')
          .trim()
          .toUpperCase(),
        ...(recallDate ? { recallDate } : {}),
      };

      updateLead.mutate(payload, {
        onSuccess: () => {
          alert("Qo'ng'iroq bo'yicha lead ma'lumotlari saqlandi", {
            type: 'success',
          });
          handleClose();
        },
        onError: (error) => {
          alert(
            error?.message || "Lead ma'lumotlarini saqlashda xatolik yuz berdi",
            { type: 'error' }
          );
        },
      });
    },
    [updateLead, alert, handleClose]
  );

  const onSubmit = handleSubmit((values) => {
    if (!leadId) {
      alert("Lead topilmadi. Iltimos, qayta urinib ko'ring.", {
        type: 'error',
      });
      return;
    }

    if (RECALL_MODAL_CONFIG[values?.status]) {
      setRecallModalStatus(values.status);
      return;
    }

    saveLeadPayload(values);
  });

  const handleRecallConfirm = (recallDate) => {
    const currentValues = {
      clientFullName: watch('clientFullName'),
      clientPhone: watch('clientPhone'),
      status: recallModalStatus,
      rejectionReason: watch('rejectionReason'),
      jshshir: watch('jshshir'),
      passportId: watch('passportId'),
    };
    setRecallModalStatus(null);
    saveLeadPayload(currentValues, recallDate);
  };

  const handleRecallClose = () => {
    setRecallModalStatus(null);
  };

  const handleInboundCall = useCallback(
    (event) => {
      const rawRecords = event?.detail?.records ?? event?.detail?.record;
      const records = Array.isArray(rawRecords)
        ? rawRecords
        : rawRecords
          ? [rawRecords]
          : [];

      if (!records.length) return;

      const recordsForCurrentUser = records
        .map((record) => normalizeInboundCallPayload(record))
        .filter((record) => record?.leadId)
        .filter((record) => belongsToCurrentUser(record, user));
      if (!recordsForCurrentUser.length) return;

      const nextInboundLead =
        recordsForCurrentUser[recordsForCurrentUser.length - 1];

      const dedupeKey = [
        nextInboundLead?.leadId,
        nextInboundLead?.clientPhone,
        nextInboundLead?.SlpCode,
      ].join('|');
      const now = Date.now();
      if (
        lastInboundRef.current.key === dedupeKey &&
        now - lastInboundRef.current.at < 1200
      ) {
        return;
      }

      lastInboundRef.current = { key: dedupeKey, at: now };

      setInboundLead(nextInboundLead);
      setOpen(true);
    },
    [user]
  );

  const handleOpenLead = useCallback(() => {
    navigate(`/leads/${leadId}`);
    setOpen(false);
  }, [navigate, leadId]);

  useEffect(() => {
    window.addEventListener(INBOUND_CALL_EVENT, handleInboundCall);
    return () => {
      window.removeEventListener(INBOUND_CALL_EVENT, handleInboundCall);
    };
  }, [handleInboundCall]);

  useEffect(() => {
    if (!inboundLead) return;

    reset({
      clientFullName: inboundLead.clientFullName || '',
      clientPhone: inboundLead.clientPhone || '',
      status: inboundLead.status || '',
      rejectionReason: inboundLead.rejectionReason || '',
      jshshir: inboundLead.jshshir || '',
      passportId: inboundLead.passportId || '',
      recallDate: formatDate(
        inboundLead.recallDate,
        'YYYY.MM.DD HH:mm',
        'DD.MM.YYYY HH:mm'
      ),
    });
  }, [inboundLead, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Qo'ng'iroq uchun tezkor lead oynasi"
      size="lg"
      className="w-[96vw] max-w-[1080px] max-h-[94vh]"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-[18px]">
        <p className="text-[12px]" style={{ color: 'var(--secondary-color)' }}>
          Operator: {user?.SlpName ?? '—'}
        </p>
        <div className="grid gap-[12px] md:grid-cols-2 xl:grid-cols-3">
          <FormField label="Isim familya">
            <Input
              type="text"
              placeholder="Mijoz ism familiyasi"
              {...register('clientFullName')}
            />
          </FormField>

          <FormField label="Telefon raqam">
            <Controller
              name="clientPhone"
              control={control}
              render={({ field }) => (
                <Input
                  type="tel"
                  inputMode="numeric"
                  placeholder="+998 XX XXX XX XX"
                  value={formatPhoneDisplay(field.value)}
                  onChange={(e) => {
                    field.onChange(normalizePhoneValue(e.target.value));
                  }}
                />
              )}
            />
          </FormField>

          <FormField label="Status">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  className="w-full"
                  value={field.value || ''}
                  onChange={(value) => field.onChange(value)}
                >
                  <SelectOption value="">Tanlang</SelectOption>
                  {statusOptions.map((option) => (
                    <SelectOption
                      key={option.value}
                      value={option.value}
                      disabled={Boolean(
                        option.isNotSelectable && option.value !== field.value
                      )}
                    >
                      {option.label}
                    </SelectOption>
                  ))}
                </Select>
              )}
            />
          </FormField>

          <FormField label="Rad etish sabablari">
            <Controller
              name="rejectionReason"
              control={control}
              render={({ field }) => (
                <Select
                  className="w-full"
                  value={field.value || ''}
                  onChange={(value) => field.onChange(value)}
                >
                  <SelectOption value="">Tanlang</SelectOption>
                  {rejectReasonOptions.map((option) => (
                    <SelectOption
                      key={option.value}
                      value={option.value}
                      disabled={Boolean(
                        option.isNotSelectable && option.value !== field.value
                      )}
                    >
                      {option.label}
                    </SelectOption>
                  ))}
                </Select>
              )}
            />
          </FormField>

          <FormField label="JSHSHIR">
            <Controller
              name="jshshir"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={14}
                  placeholder="14 ta raqam"
                  value={field.value || ''}
                  onChange={(event) => {
                    const digits = String(event?.target?.value || '')
                      .replace(/[^0-9]/g, '')
                      .slice(0, 14);
                    field.onChange(digits);
                  }}
                />
              )}
            />
          </FormField>

          <FormField label="Qayta aloqa vaqti">
            <Controller
              name="recallDate"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  disabled
                  placeholder="DD.MM.YYYY HH:mm"
                  value={field.value || ''}
                  onChange={() => {}}
                />
              )}
            />
          </FormField>

          <FormField label="Passport ID">
            <Controller
              name="passportId"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  maxLength={9}
                  placeholder="AA1234567"
                  value={field.value || ''}
                  onChange={(event) => {
                    const formatted = String(event?.target?.value || '')
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, '')
                      .replace(/^([A-Z]{0,2})([0-9]{0,7}).*/, '$1$2');
                    field.onChange(formatted);
                  }}
                />
              )}
            />
          </FormField>
        </div>

        <div className="space-y-[10px]">
          {/* <div className="flex items-center justify-between">
              <h4
                className="text-[14px] font-semibold"
                style={{ color: 'var(--primary-color)' }}
              >
                Messenger
              </h4>
            </div> */}

          <div className="h-[360px] min-h-[280px]">
            <Messenger
              className="h-full"
              messages={messages}
              currentUserId={user?.SlpCode}
              onSendMessage={sendMessage}
              onEditMessage={editMessage}
              onDeleteMessage={deleteMessage}
              isLoading={isMessagesLoading}
              onLoadMore={fetchNextPage}
              hasMore={Boolean(hasNextPage)}
              isLoadingMore={isFetchingNextPage}
              replyEnabled={false}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-[8px] border-t pt-[12px]">
          <div className="flex gap-[8px] items-center">
            <span
              className="text-[12px]"
              style={{ color: 'var(--secondary-color)' }}
            >
              Lead ID: {leadId || '—'}
            </span>
            <Button
              className="bg-transparent border-none text-sky-400"
              variant="outline"
              size="sm"
              type="button"
              onClick={handleOpenLead}
            >
              <Link /> leadni ochish
            </Button>
          </div>
          <div className="flex items-center gap-[8px]">
            <Button type="button" variant="outline" onClick={handleClose}>
              Yopish
            </Button>
            <Button
              type="submit"
              disabled={updateLead.isPending || !isDirty || !leadId}
            >
              {updateLead.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
            </Button>
          </div>
        </div>
      </form>
      <FollowUpModal
        isOpen={!!recallModalStatus}
        onClose={handleRecallClose}
        onConfirm={handleRecallConfirm}
        title={RECALL_MODAL_CONFIG[recallModalStatus]?.title}
        label={RECALL_MODAL_CONFIG[recallModalStatus]?.label}
        defaultValue={inboundLead?.recallDate || ''}
      />
    </Modal>
  );
}
