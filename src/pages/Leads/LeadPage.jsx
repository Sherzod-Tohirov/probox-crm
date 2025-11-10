import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
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
} from '@/features/leads/components/LeadPageSections';

import styles from './style.module.scss';

export default function LeadPage() {
  const { id } = useParams();
  const isMobile = useIsMobile();

  // Use custom hook for all data and logic
  const {
    lead,
    isLoading,
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
    mutateFileUpload,
    customBreadcrumbs,
    defaultTab,
  } = useLeadPageData(id);
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Save handlers
  const handleSave = (payload) => {
    updateLead.mutate(payload);
  };

  // Render sections
  const commonFields = (
    <div className={styles['fields-grid']}>
      <BlockedStatusSection
        lead={lead}
        canEdit={canEditBlockedStatus}
        onSave={handleSave}
      />
      <StatusSection lead={lead} canEdit={canEditStatus} onSave={handleSave} />
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
    </>
  );
}
