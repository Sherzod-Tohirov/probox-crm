import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

import useLeadPageData from '@/features/leads/hooks/useLeadPageData';
import useMessengerActions from '@hooks/useMessengerActions';
import useFetchMessages from '@hooks/data/useFetchMessages';
import useFetchCurrency from '@/hooks/data/useFetchCurrency';
import useFetchInvoiceScore from '@/hooks/data/clients/useFetchInvoiceScore';
import useFetchLeadLimitHistory from '@/hooks/data/leads/useFetchLeadLimitHistory';
import { Messenger } from '@/components/shadcn/ui/messenger';
import { LeadLimitHistoryModal } from '@/features/leads/components/modals/LeadLimitHistoryModal';
import useAuth from '@hooks/useAuth';

import { Button } from '@/components/shadcn/ui/button';
import ClientInfoCard from '@features/newLeads/sections/ClientInfoCard';
import PaymentScoreCard from '@features/newLeads/sections/PaymentScoreCard';
import LeadInfoCard from '@features/newLeads/sections/LeadInfoCard';
import ContractCard from '@features/newLeads/sections/ContractCard';
import SidebarPassport from '@features/newLeads/sections/SidebarPassport';
import SidebarPurchaseHistory from '@features/newLeads/sections/SidebarPurchaseHistory';
import SidebarServiceInfo from '@features/newLeads/sections/SidebarServiceInfo';

export default function NewLeadPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    lead,
    isLoading,
    isError,
    error,
    updateLead,
    setPassportFiles,
    uploadValue,
    handleUploadSingle,
    handleDeleteDocument,
    canEditTab,
  } = useLeadPageData(id);

  const [isLimitHistoryModalOpen, setLimitHistoryModalOpen] = useState(false);
  const [enableFetchLimitHistory, setEnableFetchLimitHistory] = useState(false);

  const { user } = useAuth();

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
    enabled: true,
  });

  const { sendMessage, editMessage, deleteMessage } = useMessengerActions({
    entityType: 'lead',
    entityId: id,
  });

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
      <div className="flex w-full flex-col gap-[20px]">
        {/* Sticky Header */}
        <div
          className="sticky top-0 z-10 -mx-[6rem] flex shrink-0 items-center justify-between px-[6rem] py-[16px]"
          style={{
            background: 'var(--primary-bg)',
            borderBottom: '1px solid var(--primary-border-color)',
          }}
        >
          <div className="flex items-center gap-[12px]">
            <button
              type="button"
              onClick={() => navigate('/leads')}
              className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full border-transparent transition-colors bg-[var(--primary-input-bg)] hover:opacity-80"
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

            {/* Messenger - New Shadcn Component */}
            <div style={{ height: 600 }}>
              <Messenger
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

          {/* Right column — sidebar */}
          <div className="flex w-full flex-col gap-[20px] lg:w-[320px] lg:shrink-0">
            <SidebarPassport
              uploadValue={uploadValue}
              onFilesChange={setPassportFiles}
              onUploadSingle={handleUploadSingle}
              onDelete={handleDeleteDocument}
              canEdit={canEditTab('all')}
            />

            <SidebarServiceInfo lead={lead} leadId={id} />

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
