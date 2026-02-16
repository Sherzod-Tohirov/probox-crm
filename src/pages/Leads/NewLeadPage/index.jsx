import { useParams, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

import useLeadPageData from '@/features/leads/hooks/useLeadPageData';
import useToggle from '@hooks/useToggle';
import useClickOutside from '@hooks/helper/useClickOutside';
import useMessengerActions from '@hooks/useMessengerActions';
import useFetchMessages from '@hooks/data/useFetchMessages';
import useFetchCurrency from '@/hooks/data/useFetchCurrency';
import useFetchInvoiceScore from '@/hooks/data/clients/useFetchInvoiceScore';
import useFetchLeadLimitHistory from '@/hooks/data/leads/useFetchLeadLimitHistory';
import Messenger from '@components/ui/Messenger';
import { LeadLimitHistoryModal } from '@/features/leads/components/modals/LeadLimitHistoryModal';

import { Button } from '@/components/shadcn/ui/button';
import ClientInfoCard from './sections/ClientInfoCard';
import PaymentScoreCard from './sections/PaymentScoreCard';
import LeadInfoCard from './sections/LeadInfoCard';
import ContractCard from './sections/ContractCard';
import SidebarPassport from './sections/SidebarPassport';
import SidebarServiceInfo from './sections/SidebarServiceInfo';
import SidebarPurchaseHistory from './sections/SidebarPurchaseHistory';

export default function NewLeadPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const messengerRef = useRef(null);
  const { isOpen, toggle } = useToggle('messenger');

  const {
    lead,
    isLoading,
    isError,
    error,
    executors,
    updateLead,
    setPassportFiles,
    uploadValue,
    handleUploadSingle,
    handleDeleteDocument,
    canEditTab,
  } = useLeadPageData(id);

  const [isLimitHistoryModalOpen, setLimitHistoryModalOpen] = useState(false);
  const [enableFetchLimitHistory, setEnableFetchLimitHistory] = useState(false);

  const { data: rate } = useFetchCurrency();
  const { data: invoiceScoreData } = useFetchInvoiceScore({
    CardCode: lead?.cardCode || lead?.CardCode,
  });
  const { data: limitHistoryData, isLoading: limitHistoryLoading } =
    useFetchLeadLimitHistory({
      jshshir: lead?.jshshir,
      enabled: enableFetchLimitHistory,
    });

  useEffect(() => {
    if (isLimitHistoryModalOpen) {
      setEnableFetchLimitHistory(true);
      return;
    }
    setEnableFetchLimitHistory(false);
  }, [isLimitHistoryModalOpen]);

  const {
    data: messages,
    isLoading: isMessagesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchMessages({
    entityType: 'lead',
    entityId: id,
    enabled: isOpen,
  });

  const { sendMessage, editMessage, deleteMessage } = useMessengerActions({
    entityType: 'lead',
    entityId: id,
  });

  useClickOutside(messengerRef, toggle, isOpen);

  const handleSave = (payload) => {
    updateLead.mutate(payload);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-[40px]">
        <div className="flex flex-col items-center gap-[12px]">
          <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-[var(--primary-border-color)] border-t-[var(--button-bg)]" />
          <span
            className="text-[14px]"
            style={{ color: 'var(--secondary-color)' }}
          >
            Yuklanmoqda...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-[16px] p-[40px]">
        <span
          className="text-[16px] font-semibold"
          style={{ color: 'var(--danger-color)' }}
        >
          Xatolik yuz berdi
        </span>
        <span
          className="text-[14px]"
          style={{ color: 'var(--secondary-color)' }}
        >
          {error?.message || "Lead ma'lumotlarini yuklab bo'lmadi."}
        </span>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Qayta urinish
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full w-full flex-col gap-[20px] overflow-y-auto p-[20px] lg:p-[28px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[12px]">
            <button
              type="button"
              onClick={() => navigate('/leads')}
              className="flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-[10px] transition-colors hover:bg-[var(--filter-input-bg)]"
              style={{ color: 'var(--primary-color)' }}
            >
              <ArrowLeft size={20} />
            </button>
            <h1
              className="text-[20px] font-bold"
              style={{ color: 'var(--primary-color)' }}
            >
              {lead?.clientFullName || lead?.clientName || 'Lead'}
            </h1>
          </div>
          <Button
            onClick={() => handleSave({})}
            disabled={updateLead.isPending}
          >
            <Save size={16} />
            {updateLead.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
          </Button>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col gap-[20px] lg:flex-row">
          {/* Left column — main content */}
          <div className="flex flex-1 flex-col gap-[20px]">
            <ClientInfoCard
              lead={lead}
              onLimitHistoryClick={() => setLimitHistoryModalOpen(true)}
            />

            <PaymentScoreCard
              paymentScore={invoiceScoreData?.score ?? null}
              totalSum={
                invoiceScoreData?.totalAmount && rate?.Rate
                  ? invoiceScoreData.totalAmount * rate.Rate
                  : 0
              }
              closedSum={
                invoiceScoreData?.totalPaid && rate?.Rate
                  ? invoiceScoreData.totalPaid * rate.Rate
                  : 0
              }
              overdueDebt={
                invoiceScoreData?.overdueDebt && rate?.Rate
                  ? invoiceScoreData.overdueDebt * rate.Rate
                  : 0
              }
              totalContracts={invoiceScoreData?.totalContracts ?? 0}
              openContracts={invoiceScoreData?.openContracts ?? 0}
              longestDelay={invoiceScoreData?.maxDelay ?? 0}
              averagePaymentDay={invoiceScoreData?.avgPaymentDelay ?? 0}
            />

            <LeadInfoCard lead={lead} />

            <ContractCard leadData={lead} invoiceScoreData={invoiceScoreData} />

            {/* Messenger inline */}
            <div
              className="rounded-[20px] border border-[var(--primary-border-color)] bg-[var(--primary-bg)]"
              style={{ minHeight: 400 }}
            >
              <div
                className="border-b px-[20px] py-[14px]"
                style={{ borderColor: 'var(--primary-border-color)' }}
              >
                <h3
                  className="text-[17px] font-semibold"
                  style={{ color: 'var(--primary-color)' }}
                >
                  Izohlar va harakatlar tarixi
                </h3>
              </div>
              <div style={{ height: 500 }}>
                <Messenger
                  ref={messengerRef}
                  messages={messages}
                  hasToggleControl={false}
                  isLoading={isMessagesLoading}
                  onSendMessage={sendMessage}
                  onEditMessage={editMessage}
                  onDeleteMessage={deleteMessage}
                  isOpen={true}
                  entityType="lead"
                  onLoadMore={fetchNextPage}
                  hasMore={hasNextPage}
                  isLoadingMore={isFetchingNextPage}
                  embedded
                />
              </div>
            </div>
          </div>

          {/* Right column — sidebar */}
          <div className="flex w-full flex-col gap-[20px] lg:w-[320px] lg:flex-shrink-0">
            <SidebarPassport
              uploadValue={uploadValue}
              onFilesChange={setPassportFiles}
              onUploadSingle={handleUploadSingle}
              onDelete={handleDeleteDocument}
              canEdit={canEditTab('all')}
            />

            <SidebarServiceInfo lead={lead} executors={executors} />

            <SidebarPurchaseHistory invoiceScoreData={invoiceScoreData} />
          </div>
        </div>
      </div>

      <LeadLimitHistoryModal
        isOpen={isLimitHistoryModalOpen}
        onClose={() => setLimitHistoryModalOpen(false)}
        data={limitHistoryData}
        isLoading={limitHistoryLoading}
      />
    </>
  );
}
