import { useState, useMemo, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/ui/table';
import { Button } from '@/components/shadcn/ui/button';
import { Input } from '@/components/shadcn/ui/input';
import { Select, SelectOption } from '@/components/shadcn/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/shadcn/ui/popover';
import { FileText, Search, X } from 'lucide-react';
import useAuth from '@hooks/useAuth';
import { alert } from '@/utils/globalAlert';
import { generateInvoicePdf } from '@/utils/invoicePdf';
import useInvoice from '@/hooks/data/leads/useInvoice';
import useUploadInvoiceFile from '@/hooks/data/leads/useUploadInvoiceFile';
import { useSelectOptions } from '@/features/leads/hooks/useSelectOptions';
import { useBranchFilters } from '@/features/leads/hooks/useBranchFilters';
import { useDeviceSeries } from '@/features/leads/hooks/useDeviceSeries';
import { useDeviceSearch } from '@/features/leads/hooks/useDeviceSearch';
import { useSelectedDevices } from '@/features/leads/hooks/useSelectedDevices';
import { useDeviceSelection } from '@/features/leads/hooks/useDeviceSelection';
import InvoicePaymentModal from '@/features/leads/components/LeadPageTabs/SellerTab/InvoicePaymentModal';
import { useSignatureCanvas } from '@/features/leads/components/LeadPageTabs/SellerTab/useSignatureCanvas';
import {
  CALCULATION_TYPE_OPTIONS,
  extractNumericValue,
  formatNumberWithSeparators,
} from '@/features/leads/utils/deviceUtils';
import _ from 'lodash';

function LabeledControl({ label, children }) {
  return (
    <div className="flex w-full flex-col gap-[4px]">
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

const CONDITION_FILTER_OPTIONS = [
  { value: 'all', label: 'Tanlang' },
  { value: 'Yangi', label: 'Yangi' },
  { value: 'B/U', label: 'B/U' },
];

function DeviceSearchInput({
  canEdit,
  searchTerm,
  setSearchTerm,
  isSearching,
  searchResults,
  onSelect,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (item) => {
    onSelect(item);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <Popover
      open={isOpen && canEdit && (isSearching || searchResults.length > 0)}
      onOpenChange={setIsOpen}
    >
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Search
            size={16}
            className="pointer-events-none absolute left-[12px] top-1/2 -translate-y-1/2"
            style={{ color: 'var(--secondary-color)' }}
          />
          <Input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => {
              if (searchResults.length || isSearching) setIsOpen(true);
            }}
            placeholder="Qurilma nomi bo'yicha qidirish"
            disabled={!canEdit}
            className="h-[42px] pl-[34px]"
          />
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] rounded-[10px] border p-0"
        style={{
          borderColor: 'var(--primary-border-color)',
          backgroundColor: 'var(--primary-bg)',
        }}
        align="start"
      >
        <div className="max-h-[280px] overflow-y-auto p-[6px]">
          {isSearching ? (
            <div
              className="px-[10px] py-[12px] text-[13px]"
              style={{ color: 'var(--secondary-color)' }}
            >
              Qidirilmoqda...
            </div>
          ) : searchResults.length ? (
            searchResults.map((item) => (
              <button
                key={item.id || `${item.name}-${item.whsCode}`}
                type="button"
                onClick={() => handleSelect(item)}
                className="flex w-full flex-col gap-[2px] rounded-[8px] px-[10px] py-[8px] text-left transition-colors hover:bg-[var(--primary-table-hover-bg)]"
              >
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: 'var(--primary-color)' }}
                >
                  {item.name}
                </span>
                <span
                  className="text-[11px]"
                  style={{ color: 'var(--secondary-color)' }}
                >
                  {[item.storage, item.color, item.onHand]
                    .filter(Boolean)
                    .join(' • ')}
                </span>
                <span
                  className="text-[12px] font-medium"
                  style={{ color: 'var(--success-color)' }}
                >
                  {item.price || '—'}
                </span>
              </button>
            ))
          ) : (
            <div
              className="px-[10px] py-[12px] text-[13px]"
              style={{ color: 'var(--secondary-color)' }}
            >
              Qurilma topilmadi
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SignaturePad({ canEdit, onSignatureChange }) {
  const {
    signatureCanvasRef,
    signatureWrapperRef,
    hasSignature,
    handleSignaturePointerDown,
    handleSignaturePointerMove,
    handleSignaturePointerUp,
    clearSignature,
  } = useSignatureCanvas(onSignatureChange);

  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex items-center justify-between gap-[8px]">
        <span
          className="text-[14px] font-semibold"
          style={{ color: 'var(--primary-color)' }}
        >
          Imzolash uchun maydon
        </span>
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={clearSignature}
          disabled={!canEdit || !hasSignature}
        >
          <X size={14} />
        </Button>
      </div>

      <div
        ref={signatureWrapperRef}
        className="h-[180px] w-full overflow-hidden rounded-[12px] border md:h-[220px]"
        style={{
          borderColor: 'var(--primary-border-color)',
          backgroundColor: 'var(--primary-bg)',
        }}
      >
        <canvas
          ref={signatureCanvasRef}
          className={`h-full w-full ${!canEdit ? 'pointer-events-none opacity-70' : ''}`}
          aria-label="Imzo chizish maydoni"
          onPointerDown={handleSignaturePointerDown}
          onPointerMove={handleSignaturePointerMove}
          onPointerUp={handleSignaturePointerUp}
          onPointerLeave={handleSignaturePointerUp}
          onPointerCancel={handleSignaturePointerUp}
        />
      </div>
    </div>
  );
}

export default function ContractCard({
  leadId,
  leadData,
  invoiceScoreData,
  canEdit,
}) {
  const { user } = useAuth();
  const isOperatorM = user?.U_role === 'OperatorM';
  const isOperator1 = user?.U_role === 'Operator1';
  const isOperator2 = user?.U_role === 'Operator2';
  const isCEO = user?.U_role === 'CEO';
  const canOperatorEdit = isOperatorM || isOperator1 || isOperator2 || isCEO;

  // Local form for device search filters
  const form = useForm({
    defaultValues: {
      branch2: leadData?.branch2 ?? '',
      conditionFilter: 'all',
      searchBranchFilter: 'all',
      calculationTypeFilter: 'markup',
    },
  });
  const { watch, setValue, reset } = form;
  const fieldBranch = watch('branch2');
  const searchBranchFilter = watch('searchBranchFilter');
  const conditionFilter = watch('conditionFilter');
  const calculationTypeFilter = watch('calculationTypeFilter');

  useEffect(() => {
    if (leadData) {
      reset((prev) => ({
        ...prev,
        branch2: leadData?.branch2 ?? '',
      }));
    }
  }, [leadData, reset]);

  const { branchOptions } = useSelectOptions('seller');

  const { branchCodeToNameMap, activeWhsCode, branchFilterOptions } =
    useBranchFilters({
      branchOptions,
      fieldBranch,
      searchBranchFilter,
      leadData,
      form,
      watch,
      setValue,
      leadId,
    });

  const rentPeriodOptions = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        value: i + 1,
        label: String(i + 1),
      })),
    []
  );

  const monthlyLimit = useMemo(() => {
    if (calculationTypeFilter === 'internalLimit') {
      const limit = Number(invoiceScoreData?.monthlyLimit);
      return Number.isFinite(limit) && limit > 0 ? limit : null;
    }
    const limit = Number(leadData?.finalLimit);
    return Number.isFinite(limit) && limit > 0 ? limit : null;
  }, [
    leadData?.finalLimit,
    calculationTypeFilter,
    invoiceScoreData?.monthlyLimit,
  ]);

  const finalPercentage = useMemo(() => {
    const pct = Number(leadData?.finalPercentage);
    return Number.isFinite(pct) && pct > 0 ? pct : null;
  }, [leadData?.finalPercentage]);

  const maximumLimit = useMemo(() => {
    if (calculationTypeFilter === 'internalLimit')
      return Number(invoiceScoreData?.monthlyLimit ?? 0);
    const limit = Number(leadData?.finalLimit);
    return Number.isFinite(limit) && limit > 0 ? limit : null;
  }, [leadData?.finalLimit, calculationTypeFilter, invoiceScoreData]);

  const isRentPeriodDisabled = useMemo(() => {
    if (
      ['markup', 'internalLimit'].includes(calculationTypeFilter) &&
      !maximumLimit
    )
      return true;
    if (calculationTypeFilter === 'firstPayment' && !finalPercentage)
      return true;
    return false;
  }, [calculationTypeFilter, maximumLimit, finalPercentage]);

  const isFirstPaymentDisabled = isRentPeriodDisabled;

  const {
    selectedDevices,
    setSelectedDevices,
    selectedDeviceData,
    totalGrandTotal,
    handleImeiSelect,
    handleDeleteDevice,
    handleRentPeriodChange,
    handleFirstPaymentChange,
    handleFirstPaymentBlur,
  } = useSelectedDevices({
    rentPeriodOptions,
    monthlyLimit,
    conditionFilter,
    calculationTypeFilter: calculationTypeFilter || '',
    finalPercentage,
    maximumLimit,
  });

  const { fetchDeviceSeries } = useDeviceSeries({
    branchCodeToNameMap,
    setSelectedDevices,
  });
  const { handleDeviceSearch } = useDeviceSearch({
    activeWhsCode,
    searchBranchFilter,
    branchCodeToNameMap,
    conditionFilter,
  });
  const { handleSelectDevice } = useDeviceSelection({
    activeWhsCode,
    branchFilterOptions,
    setValue,
    setSelectedDevices,
    fetchDeviceSeries,
  });

  const [userSignature, setUserSignature] = useState(null);
  const handleSignatureChange = useCallback((sig) => setUserSignature(sig), []);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const { mutateAsync: uploadInvoiceFile } = useUploadInvoiceFile();
  const { mutateAsync: sendInvoice, isPending: isSendingInvoice } = useInvoice({
    onSuccess: async (invoiceData) => {
      if (invoiceData && leadId) {
        try {
          const pdfFile = await generateInvoicePdf({
            ...invoiceData,
            userSignature: userSignature || null,
            currentUser: user || null,
          });
          if (pdfFile) {
            await uploadInvoiceFile({
              file: pdfFile,
              leadId,
              docNum: invoiceData.invoiceDocNum,
            });
          }
          alert('Invoice va PDF fayl muvaffaqiyatli yuborildi!', {
            type: 'success',
          });
        } catch (err) {
          alert(err?.message || 'PDF yaratishda xatolik', { type: 'error' });
        }
      } else {
        alert('Invoice muvaffaqiyatli yuborildi!', { type: 'success' });
      }
    },
    onError: (err) => {
      alert(
        err?.message ||
          err?.response?.data?.message ||
          'Invoice yuborishda xatolik',
        { type: 'error' }
      );
    },
  });

  const requiredAddressFields = [
    'region',
    'district',
    'neighborhood',
    'street',
    'house',
  ];
  const isAddressAvailable = _.every(requiredAddressFields, (key) =>
    _.get(leadData, key)
  );

  const handleOpenInvoiceModal = useCallback(() => {
    if (!isAddressAvailable) {
      alert("Invoice yuborishdan oldin manzilni to'liq to'ldirishingiz kerak", {
        type: 'error',
      });
      return;
    }
    if (!userSignature) {
      alert("Invoice yuborishdan oldin imzo qo'yishingiz kerak", {
        type: 'error',
      });
      return;
    }
    const names = [leadData?.clientFullName, leadData?.clientName].map((n) =>
      (n || '').trim()
    );
    if (!names.some((n) => n.split(/\s+/).filter(Boolean).length >= 3)) {
      alert("Mijoz ismi to'liq bo'lishi kerak (3 qism)", { type: 'error' });
      return;
    }
    if (['Closed'].includes(leadData?.status)) {
      alert("Mijoz statusi sotuv uchun o'zgartirilishi kerak!", {
        type: 'error',
      });
      return;
    }
    if (!leadId) {
      alert('Lead ID topilmadi', { type: 'error' });
      return;
    }
    if (!selectedDevices?.length) {
      alert('Qurilma tanlanmagan', { type: 'error' });
      return;
    }
    const withoutImei = selectedDevices.filter(
      (d) => !d.imeiValue || d.imeiValue === ''
    );
    if (withoutImei.length > 0) {
      alert('Barcha qurilmalar uchun IMEI tanlanishi kerak', { type: 'error' });
      return;
    }
    setIsInvoiceModalOpen(true);
  }, [userSignature, leadId, selectedDevices, isAddressAvailable, leadData]);

  const handleSendInvoice = useCallback(
    async (paymentData) => {
      if (!leadId || !selectedDevices?.length) return;
      if (!leadData?.clientPhone) {
        alert('Mijoz telefon raqami mavjud emas', { type: 'error' });
        return;
      }
      const totalPayment =
        (paymentData.cash || 0) +
        (paymentData.card || 0) +
        (paymentData.terminal || 0);
      if (totalPayment === 0) {
        alert("To'lov summasi kiritilmagan", { type: 'error' });
        return;
      }
      const payments = [];
      if (paymentData.cash > 0)
        payments.push({ type: 'Cash', amount: paymentData.cash });
      if (paymentData.card > 0)
        payments.push({ type: 'Card', amount: paymentData.card });
      if (paymentData.terminal > 0)
        payments.push({ type: 'Terminal', amount: paymentData.terminal });
      try {
        await sendInvoice({
          leadId,
          selectedDevices,
          paymentType: 'all',
          calculationTypeFilter,
          internalLimit: invoiceScoreData?.limit,
          payments,
          maximumLimit,
          monthlyLimit,
          finalPercentage,
        });
        setIsInvoiceModalOpen(false);
      } catch (_err) {
        // handled by onError
      }
    },
    [
      leadId,
      selectedDevices,
      sendInvoice,
      calculationTypeFilter,
      invoiceScoreData,
      leadData,
      maximumLimit,
      monthlyLimit,
      finalPercentage,
    ]
  );

  const canAnyEdit = canOperatorEdit || canEdit;
  const maximumLimitText = maximumLimit
    ? `${formatNumberWithSeparators(maximumLimit)} uzs`
    : "Ma'lumot yo'q";

  useEffect(() => {
    let isActive = true;
    const timer = setTimeout(async () => {
      const query = searchTerm.trim();
      if (!query) {
        if (isActive) {
          setSearchResults([]);
          setIsSearching(false);
        }
        return;
      }

      setIsSearching(true);
      try {
        const result = await handleDeviceSearch(query, 1);
        if (!isActive) return;
        setSearchResults(Array.isArray(result?.data) ? result.data : []);
      } catch {
        if (isActive) setSearchResults([]);
      } finally {
        if (isActive) setIsSearching(false);
      }
    }, 250);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [searchTerm, handleDeviceSearch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shartnoma ma'lumotlari</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-[12px]">
        <div
          className="rounded-[16px] border p-[12px] md:p-[14px]"
          style={{
            borderColor: 'var(--primary-border-color)',
            backgroundColor: 'var(--primary-bg)',
          }}
        >
          <div className="flex flex-col gap-[10px]">
            <div className="grid grid-cols-1 gap-[10px] md:grid-cols-4">
              <LabeledControl label="Xisoblash turi">
                <Select
                  value={calculationTypeFilter || ''}
                  onChange={(value) => setValue('calculationTypeFilter', value)}
                  disabled={!canAnyEdit}
                  className="w-full"
                >
                  {CALCULATION_TYPE_OPTIONS.map((option) => (
                    <SelectOption
                      key={option.value || 'empty'}
                      value={option.value}
                    >
                      {option.label || 'Tanlang'}
                    </SelectOption>
                  ))}
                </Select>
              </LabeledControl>

              <LabeledControl label="Filial">
                <Select
                  value={searchBranchFilter || ''}
                  onChange={(value) => setValue('searchBranchFilter', value)}
                  disabled={!canAnyEdit}
                  className="w-full"
                >
                  {(
                    branchFilterOptions || [{ value: 'all', label: 'Tanlang' }]
                  ).map((option) => (
                    <SelectOption key={option.value} value={option.value}>
                      {option.label}
                    </SelectOption>
                  ))}
                </Select>
              </LabeledControl>

              <LabeledControl label="Holat">
                <Select
                  value={conditionFilter || 'all'}
                  onChange={(value) => setValue('conditionFilter', value)}
                  disabled={!canAnyEdit}
                  className="w-full"
                >
                  {CONDITION_FILTER_OPTIONS.map((option) => (
                    <SelectOption key={option.value} value={option.value}>
                      {option.label}
                    </SelectOption>
                  ))}
                </Select>
              </LabeledControl>

              <LabeledControl label="Maksimal limit">
                <div
                  className="flex h-[40px] items-center rounded-[8px] px-[12px] text-[14px] font-semibold"
                  style={{
                    backgroundColor: 'var(--success-bg)',
                    color: 'var(--success-color)',
                  }}
                >
                  {maximumLimitText}
                </div>
              </LabeledControl>
            </div>

            {canAnyEdit && (
              <LabeledControl label="Qidirish">
                <DeviceSearchInput
                  canEdit={canAnyEdit}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  isSearching={isSearching}
                  searchResults={searchResults}
                  onSelect={handleSelectDevice}
                />
              </LabeledControl>
            )}

            <Table className="min-w-[900px] border-spacing-y-0 text-[14px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">№</TableHead>
                  <TableHead className="min-w-[220px] text-left">
                    Mahsulot nomi
                  </TableHead>
                  <TableHead className="min-w-[200px]">IMEI raqami</TableHead>
                  <TableHead className="min-w-[170px]">Narx</TableHead>
                  <TableHead className="min-w-[130px]">Ijara oyi</TableHead>
                  <TableHead className="min-w-[170px]">
                    Birinchi to'lov
                  </TableHead>
                  <TableHead className="w-[64px]">O'chirish</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedDeviceData.length ? (
                  selectedDeviceData.map((device, index) => {
                    const numericPrice = extractNumericValue(device.price);
                    return (
                      <TableRow key={device.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="text-left">
                          <div className="flex flex-col">
                            <span className="font-semibold">{device.name}</span>
                            <span
                              className="text-[11px]"
                              style={{ color: 'var(--secondary-color)' }}
                            >
                              {[device.storage, device.color]
                                .filter(Boolean)
                                .join(' • ') || '—'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={device.imeiValue || ''}
                            onChange={(value) =>
                              handleImeiSelect(device.id, value)
                            }
                            disabled={!canAnyEdit || device.imeiLoading}
                            className="h-[34px] w-full text-[13px]"
                          >
                            <SelectOption value="">
                              {device.imeiLoading
                                ? 'Yuklanmoqda...'
                                : 'Tanlang'}
                            </SelectOption>
                            {(device.imeiOptions || []).map((option) => (
                              <SelectOption
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectOption>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell>
                          {numericPrice
                            ? `${formatNumberWithSeparators(numericPrice)} uzs`
                            : '—'}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={1}
                            max={15}
                            value={device.rentPeriod || ''}
                            onChange={(e) =>
                              handleRentPeriodChange(device.id, e.target.value)
                            }
                            disabled={!canAnyEdit || isRentPeriodDisabled}
                            className="h-[34px] rounded-[8px] px-[8px] text-center text-[13px]"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={
                              device.firstPayment === '' ||
                              device.firstPayment === null ||
                              device.firstPayment === undefined
                                ? ''
                                : formatNumberWithSeparators(
                                    device.firstPayment
                                  )
                            }
                            onChange={(e) =>
                              handleFirstPaymentChange(
                                device.id,
                                e.target.value
                              )
                            }
                            onBlur={() => handleFirstPaymentBlur(device.id)}
                            disabled={!canAnyEdit || isFirstPaymentDisabled}
                            placeholder="0"
                            className="h-[34px] rounded-[8px] px-[8px] text-center text-[13px]"
                          />
                        </TableCell>
                        <TableCell>
                          {canAnyEdit ? (
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDeleteDevice(device.id)}
                            >
                              <X size={14} />
                            </Button>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div
                        className="flex items-center justify-center gap-[8px] py-[12px]"
                        style={{ color: 'var(--secondary-color)' }}
                      >
                        <FileText size={16} />
                        Qurilmalar tanlanmagan
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5} className="text-left font-semibold">
                    Jami to'lov
                  </TableCell>
                  <TableCell colSpan={2} className="font-bold">
                    {formatNumberWithSeparators(totalGrandTotal || 0)} uzs
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>

            <SignaturePad
              canEdit={canAnyEdit}
              onSignatureChange={handleSignatureChange}
            />

            {canAnyEdit && (
              <div className="flex justify-start">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleOpenInvoiceModal}
                  disabled={
                    isSendingInvoice ||
                    !selectedDevices.length ||
                    !userSignature
                  }
                  className="px-[16px]"
                >
                  {isSendingInvoice ? 'Yuborilmoqda...' : 'Invoice yuborish'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Invoice modal */}
        <InvoicePaymentModal
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          selectedDeviceData={selectedDeviceData}
          onConfirm={handleSendInvoice}
          isLoading={isSendingInvoice}
          leadId={leadId}
          leadData={leadData}
          selectedDevices={selectedDevices}
          calculationTypeFilter={calculationTypeFilter}
        />
      </CardContent>
    </Card>
  );
}
