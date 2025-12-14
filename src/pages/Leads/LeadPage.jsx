import { useParams } from 'react-router-dom';
import { useMemo, useState, useRef } from 'react';
import {
  Row,
  Col,
  Typography,
  Tabs,
  Navigation,
  Card,
  SkeletonCard,
  SkeletonNavigation,
} from '@components/ui';

import useIsMobile from '@/hooks/useIsMobile';
import useLeadPageData from '@/features/leads/hooks/useLeadPageData';
import useToggle from '@hooks/useToggle';
import useClickOutside from '@hooks/helper/useClickOutside';
import useMessengerActions from '@hooks/useMessengerActions';
import useFetchMessages from '@hooks/data/useFetchMessages';
import Messenger from '@components/ui/Messenger';

// Import tab components
import Operator1Tab from '@/features/leads/components/LeadPageTabs/Operator1Tab';
import Operator2Tab from '@/features/leads/components/LeadPageTabs/Operator2Tab';
import SellerTab from '@/features/leads/components/LeadPageTabs/SellerTab';
import ScoringTab from '@/features/leads/components/LeadPageTabs/ScoringTab';
// Import section components
import {
  StatusSection,
  ClientInfoSection,
  AddressSection,
  SourceInfoSection,
  AssignmentsSection,
  CommentSection,
  PassportSection,
  BlockedStatusSection,
  BlockedWarningCard,
  PaymentScoreGauge,
} from '@/features/leads/components/LeadPageSections';

import styles from './styles/style.module.scss';
import Offline from '@/pages/helper/Offline';
import Error from '@/pages/helper/Error';

export default function LeadPage() {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const messengerRef = useRef(null);
  const { isOpen, toggle } = useToggle('messenger');

  // Use custom hook for all data and logic
  const {
    lead,
    isLoading,
    isError,
    error,
    executors,
    isOperatorManager,
    isBlocked,
    canEditTab,
    canEditAddress,
    canEditStatus,
    canEditBlockedStatus,
    updateLead,
    passportFiles,
    setPassportFiles,
    uploadValue,
    handleUploadDocuments,
    handleUploadSingle,
    handleDeleteDocument,
    mutateFileUpload,
    customBreadcrumbs,
    defaultTab,
  } = useLeadPageData(id);
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Fetch messenger messages with infinite scroll
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

  // Messenger actions
  const { sendMessage, editMessage, deleteMessage } = useMessengerActions({
    entityType: 'lead',
    entityId: id,
  });

  // Handle outside click to close messenger
  useClickOutside(messengerRef, toggle, isOpen);

  // Save handlers
  const handleSave = (payload) => {
    updateLead.mutate(payload);
  };

  // Render sections
  const commonFields = (
    <div className={styles['fields-grid']}>
      <div className={styles['common-fields']}>
        <div className={styles['common-fields-left']}>
          <BlockedStatusSection
            lead={lead}
            canEdit={canEditBlockedStatus}
            onSave={handleSave}
          />
          <StatusSection
            lead={lead}
            canEdit={canEditStatus}
            onSave={handleSave}
          />
        </div>
        {/* Payment Score Card */}
        <div className={styles['common-fields-right']}>
          <PaymentScoreGauge paymentScore={lead?.paymentScore} />
        </div>
      </div>
      <ClientInfoSection lead={lead} />
      <AddressSection
        lead={lead}
        canEdit={canEditAddress}
        onSave={handleSave}
        isPending={updateLead.isPending}
      />
      <SourceInfoSection lead={lead} />
      <AssignmentsSection
        lead={lead}
        executors={executors}
        isOperatorManager={isOperatorManager}
        onSave={handleSave}
      />
      <CommentSection lead={lead} onSave={handleSave} />
      <PassportSection
        canEdit={canEditTab('all')}
        uploadValue={uploadValue}
        passportFiles={passportFiles}
        onFilesChange={setPassportFiles}
        onUpload={handleUploadDocuments}
        onUploadSingle={handleUploadSingle}
        onDelete={handleDeleteDocument}
        isUploading={mutateFileUpload.isLoading}
      />
    </div>
  );

  const tabs = useMemo(
    () => [
      {
        key: 'operator1',
        label: 'Operator1',
        content: (
          <Operator1Tab
            leadId={id}
            leadData={lead}
            canEdit={canEditTab('operator1') || canEditTab('operatorM')}
          />
        ),
      },
      {
        key: 'operator2',
        label: 'Operator2',
        content: (
          <Operator2Tab
            leadId={id}
            leadData={lead}
            canEdit={canEditTab('operator2') || canEditTab('operatorM')}
          />
        ),
      },
      {
        key: 'seller',
        label: 'Sotuvchi',
        content: (
          <SellerTab
            leadId={id}
            leadData={lead}
            canEdit={canEditTab('seller')}
          />
        ),
      },
      {
        key: 'scoring',
        label: 'Tekshirish xodimi',
        content: (
          <ScoringTab
            leadId={id}
            leadData={lead}
            canEdit={canEditTab('scoring')}
          />
        ),
      },
    ],
    [id, lead, canEditTab]
  );

  if (isLoading) {
    return (
      <>
        <Row
          gutter={isMobile ? 2 : 6}
          style={{ width: '100%', height: '100%' }}
        >
          <Col fullWidth>
            <Row
              direction={{ xs: 'column', md: 'row' }}
              gutter={{ xs: 2, md: 3 }}
            >
              <Col flexGrow>
                <SkeletonNavigation />
              </Col>
            </Row>
          </Col>

          <Col fullWidth>
            <Row gutter={isMobile ? 4 : 6}>
              <Col fullWidth>
                <SkeletonCard />
              </Col>
              <Col fullWidth>
                <SkeletonCard />
              </Col>
              <Col fullWidth>
                <SkeletonCard />
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  }

  // Offline or error state: render stable page to avoid loops
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return <Offline />;
  }
  if (isError) {
    return (
      <Error
        error={
          error || {
            message:
              "Lead ma'lumotlarini yuklab bo'lmadi. Iltimos, keyinroq qayta urinib ko'ring.",
          }
        }
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <>
      <Row gutter={12} style={{ width: '100%', height: '100%' }}>
        <Col fullWidth>
          <Row
            direction={{ xs: 'column', md: 'row' }}
            gutter={{ xs: 2, md: 3 }}
          >
            <Col flexGrow>
              <Navigation
                fallbackBackPath="/leads"
                customBreadcrumbs={customBreadcrumbs}
              />
            </Col>
          </Row>
        </Col>

        <Col fullWidth>
          <Row gutter={isMobile ? 4 : 6}>
            {/* Blocked Warning Card */}
            {isBlocked && (
              <Col fullWidth>
                <BlockedWarningCard />
              </Col>
            )}

            {/* Common Fields Card */}
            <Col fullWidth>
              <Card title="Umumiy ma'lumotlar">{commonFields}</Card>
            </Col>

            {/* Tabs Card */}
            <Col fullWidth>
              <Card>
                <Tabs tabs={tabs} value={activeTab} onChange={setActiveTab} />
              </Card>
            </Col>

            {/* History Card */}
            <Col fullWidth>
              <Card title="Tarix">
                <div className={styles['empty-state']}>
                  <Typography variant="body2" color="textSecondary">
                    Tarix ma'lumotlari hali mavjud emas
                  </Typography>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <Messenger
        ref={messengerRef}
        messages={messages}
        hasToggleControl={false}
        isLoading={isMessagesLoading}
        onSendMessage={sendMessage}
        onEditMessage={editMessage}
        onDeleteMessage={deleteMessage}
        isOpen={isOpen}
        entityType="lead"
        onLoadMore={fetchNextPage}
        hasMore={hasNextPage}
        isLoadingMore={isFetchingNextPage}
      />
    </>
  );
}
