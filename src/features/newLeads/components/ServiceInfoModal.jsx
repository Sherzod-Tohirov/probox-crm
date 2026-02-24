import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/ui/dialog';
import { Button } from '@/components/shadcn/ui/button';
import { Input } from '@/components/shadcn/ui/input';
import { Select, SelectOption } from '@/components/shadcn/ui/select';
import { canEditTab } from '../config/permissions';
import useAuth from '@hooks/useAuth';

function LabeledField({ label, children, required }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <span
        className="text-[13px] font-medium"
        style={{ color: 'var(--secondary-color)' }}
      >
        {label}
        {required && (
          <span className="ml-[4px]" style={{ color: 'var(--danger-color)' }}>
            *
          </span>
        )}
      </span>
      {children}
    </div>
  );
}

export default function ServiceInfoModal({
  isOpen,
  onClose,
  lead,
  executors,
  onSave,
}) {
  const { user } = useAuth();
  const userRole = user?.role;

  const [activeTab, setActiveTab] = useState(() => {
    if (canEditTab(userRole, 'operator')) return 'operator';
    if (canEditTab(userRole, 'seller')) return 'seller';
    if (canEditTab(userRole, 'scoring')) return 'scoring';
    return 'operator';
  });

  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      // Operator tab
      meetingConfirmed: lead?.meetingConfirmed || '',
      meetingDate: lead?.meetingDate || '',
      branch: lead?.branch || '',
      seller: lead?.seller || '',
      // Seller tab
      saleType: lead?.saleType || '',
      purchase: lead?.purchase || '',
      // Scoring tab
      scoringResult: lead?.scoringResult || '',
      katm: lead?.katm || '',
      mib: lead?.mib || '',
    },
  });

  const canEditOperator = canEditTab(userRole, 'operator');
  const canEditSeller = canEditTab(userRole, 'seller');
  const canEditScoring = canEditTab(userRole, 'scoring');

  const onSubmit = handleSubmit((values) => {
    const payload = {};

    // Only include fields from tabs user can edit
    if (canEditOperator && activeTab === 'operator') {
      payload.meetingConfirmed = values.meetingConfirmed;
      payload.meetingDate = values.meetingDate;
      payload.branch = values.branch;
      payload.seller = values.seller;
    }
    if (canEditSeller && activeTab === 'seller') {
      payload.saleType = values.saleType;
      payload.purchase = values.purchase;
      payload.meetingConfirmed = values.meetingConfirmed;
    }
    if (canEditScoring && activeTab === 'scoring') {
      payload.scoringResult = values.scoringResult;
      payload.katm = values.katm;
      payload.mib = values.mib;
    }

    onSave?.(payload);
    onClose?.();
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Xizmat ma'lumotlari</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-[20px]">
          {/* Radio Tabs */}
          <div className="flex items-center gap-[16px]">
            <label className="flex cursor-pointer items-center gap-[6px]">
              <input
                type="radio"
                name="tab"
                checked={activeTab === 'operator'}
                onChange={() => setActiveTab('operator')}
                disabled={!canEditOperator}
                className="h-[16px] w-[16px] cursor-pointer"
              />
              <span
                className="text-[14px] font-medium"
                style={{ color: 'var(--primary-color)' }}
              >
                Operator
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-[6px]">
              <input
                type="radio"
                name="tab"
                checked={activeTab === 'seller'}
                onChange={() => setActiveTab('seller')}
                disabled={!canEditSeller}
                className="h-[16px] w-[16px] cursor-pointer"
              />
              <span
                className="text-[14px] font-medium"
                style={{ color: 'var(--primary-color)' }}
              >
                Sotuvchi
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-[6px]">
              <input
                type="radio"
                name="tab"
                checked={activeTab === 'scoring'}
                onChange={() => setActiveTab('scoring')}
                disabled={!canEditScoring}
                className="h-[16px] w-[16px] cursor-pointer"
              />
              <span
                className="text-[14px] font-medium"
                style={{ color: 'var(--primary-color)' }}
              >
                Tekshiruv
              </span>
            </label>
          </div>

          {/* Tab Content */}
          <div className="flex flex-col gap-[14px]">
            {activeTab === 'operator' && (
              <>
                <LabeledField label="Qo'ng'iroq qilindimi?">
                  <Select
                    {...register('meetingConfirmed')}
                    disabled={!canEditOperator}
                  >
                    <SelectOption value="">Tanlang</SelectOption>
                    <SelectOption value="true">Ha</SelectOption>
                    <SelectOption value="false">Yo'q</SelectOption>
                  </Select>
                </LabeledField>

                <LabeledField label="Vaqti">
                  <Input
                    type="text"
                    placeholder="kk.oo.yyyy | 00:00"
                    {...register('meetingDate')}
                    disabled={!canEditOperator}
                  />
                </LabeledField>

                <LabeledField label="Javob berildimi?">
                  <Select disabled={!canEditOperator}>
                    <SelectOption value="">Tanlang</SelectOption>
                    <SelectOption value="true">Ha</SelectOption>
                    <SelectOption value="false">Yo'q</SelectOption>
                  </Select>
                </LabeledField>

                <LabeledField label="Qiziqish bildirildi?">
                  <Select disabled={!canEditOperator}>
                    <SelectOption value="">Tanlang</SelectOption>
                    <SelectOption value="true">Ha</SelectOption>
                    <SelectOption value="false">Yo'q</SelectOption>
                  </Select>
                </LabeledField>

                <LabeledField label="Rad etish sababi?">
                  <Select disabled={!canEditOperator}>
                    <SelectOption value="">Tanlang</SelectOption>
                  </Select>
                </LabeledField>

                <LabeledField label="Filial">
                  <Select {...register('branch')} disabled={!canEditOperator}>
                    <SelectOption value="">Tanlang</SelectOption>
                  </Select>
                </LabeledField>

                <LabeledField label="Sotuvchi">
                  <Select {...register('seller')} disabled={!canEditOperator}>
                    <SelectOption value="">Tanlang</SelectOption>
                    {(executors || [])
                      .filter(
                        (e) => e?.U_role === 'Seller' || e?.U_role === 'SellerM'
                      )
                      .map((e) => (
                        <SelectOption key={e.SlpCode} value={String(e.SlpCode)}>
                          {e.SlpName}
                        </SelectOption>
                      ))}
                  </Select>
                </LabeledField>
              </>
            )}

            {activeTab === 'seller' && (
              <>
                <LabeledField label="Uchrashuv tasdiqlandimi">
                  <Select
                    {...register('meetingConfirmed')}
                    disabled={!canEditSeller}
                  >
                    <SelectOption value="">Tanlang</SelectOption>
                    <SelectOption value="true">Ha</SelectOption>
                    <SelectOption value="false">Yo'q</SelectOption>
                  </Select>
                </LabeledField>

                <LabeledField label="Savdo turi">
                  <Select {...register('saleType')} disabled={!canEditSeller}>
                    <SelectOption value="">Tanlang</SelectOption>
                  </Select>
                </LabeledField>

                <LabeledField label="Xarid amalga oshdimi">
                  <Select {...register('purchase')} disabled={!canEditSeller}>
                    <SelectOption value="">Tanlang</SelectOption>
                    <SelectOption value="true">Ha</SelectOption>
                    <SelectOption value="false">Yo'q</SelectOption>
                  </Select>
                </LabeledField>
              </>
            )}

            {activeTab === 'scoring' && (
              <>
                <LabeledField label="Skoring natija">
                  <Input
                    type="text"
                    placeholder="—"
                    {...register('scoringResult')}
                    disabled={!canEditScoring}
                  />
                </LabeledField>

                <LabeledField label="KATM">
                  <Input
                    type="text"
                    placeholder="—"
                    {...register('katm')}
                    disabled={!canEditScoring}
                  />
                </LabeledField>

                <LabeledField label="MIB">
                  <Input
                    type="text"
                    placeholder="—"
                    {...register('mib')}
                    disabled={!canEditScoring}
                  />
                </LabeledField>
              </>
            )}
          </div>

          {/* Footer with Saqlash button */}
          <div
            className="flex justify-end gap-[10px] border-t pt-[16px]"
            style={{ borderColor: 'var(--primary-border-color)' }}
          >
            <Button type="button" variant="outline" onClick={onClose}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={!isDirty}>
              Saqlash
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
