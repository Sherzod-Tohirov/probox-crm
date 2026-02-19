import { Controller, useForm } from 'react-hook-form';
import { useCallback, useEffect, useRef, useState } from 'react';

import useAuth from '@hooks/useAuth';
import useAlert from '@hooks/useAlert';
import useFetchMessages from '@hooks/data/useFetchMessages';
import useMessengerActions from '@hooks/useMessengerActions';
import useMutateLead from '@/hooks/data/leads/useMutateLead';
import { statusOptions } from '@/features/leads/utils/options';
import { Messenger } from '@/components/shadcn/ui/messenger';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/ui/dialog';
import { Button } from '@/components/shadcn/ui/button';
import { Input } from '@/components/shadcn/ui/input';
import { Select, SelectOption } from '@/components/shadcn/ui/select';

const INBOUND_CALL_EVENT = 'probox:inbound-call';

const DEFAULT_FORM_VALUES = {
  clientFullName: '',
  clientPhone: '',
  status: '',
  rejectionReason: '',
  jshshir: '',
  passportId: '',
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

  const [isOpen, setOpen] = useState(false);
  const [inboundLead, setInboundLead] = useState(null);
  const lastInboundRef = useRef({ key: '', at: 0 });

  const {
    register,
    control,
    handleSubmit,
    reset,
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
    reset(DEFAULT_FORM_VALUES);
  }, [reset]);

  const onSubmit = handleSubmit((values) => {
    if (!leadId) {
      alert("Lead topilmadi. Iltimos, qayta urinib ko'ring.", {
        type: 'error',
      });
      return;
    }

    const payload = {
      clientFullName: String(values?.clientFullName || '').trim(),
      clientPhone: String(values?.clientPhone || '').trim(),
      status: String(values?.status || '').trim(),
      rejectionReason: String(values?.rejectionReason || '').trim(),
      jshshir: String(values?.jshshir || '').trim(),
      passportId: String(values?.passportId || '')
        .trim()
        .toUpperCase(),
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
  });

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
    });
  }, [inboundLead, reset]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose();
        }
      }}
    >
      <DialogContent
        onClose={handleClose}
        className="w-[96vw] max-w-[1080px] max-h-[94vh]"
      >
        <DialogHeader>
          <DialogTitle>Kiruvchi qo'ng'iroq uchun tezkor lead oynasi</DialogTitle>
          <DialogDescription>
            Lead: {leadId || "Noma'lum"} • Operator: {user?.SlpCode ?? '—'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-[18px]">
          <div className="grid gap-[12px] md:grid-cols-2 xl:grid-cols-3">
            <FormField label="Isim familya">
              <Input
                type="text"
                placeholder="Mijoz ism familiyasi"
                {...register('clientFullName')}
              />
            </FormField>

            <FormField label="Telefon raqam">
              <Input
                type="tel"
                placeholder="+998"
                {...register('clientPhone')}
              />
            </FormField>

            <FormField label="Status">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
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
              <Input
                type="text"
                placeholder="Sababni kiriting"
                {...register('rejectionReason')}
              />
            </FormField>

            <FormField label="JSSHR">
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

            <FormField label="PASSPORT ID">
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
            <div className="flex items-center justify-between">
              <h4
                className="text-[14px] font-semibold"
                style={{ color: 'var(--primary-color)' }}
              >
                Messenger
              </h4>
            </div>

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

          <DialogFooter className="border-t pt-[12px] sm:justify-between sm:items-center">
            <span
              className="text-[12px]"
              style={{ color: 'var(--secondary-color)' }}
            >
              Lead ID: {leadId || '—'}
            </span>
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
