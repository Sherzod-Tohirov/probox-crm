import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
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

import useFetchLeadById from '@/hooks/data/leads/useFetchLeadById';
import useAuth from '@/hooks/useAuth';
import useIsMobile from '@/hooks/useIsMobile';

import { Globe } from '@/assets/images/icons/Icons';

// Import feature components
import Operator1Tab from '@/features/leads/components/LeadPageTabs/Operator1Tab';
import Operator2Tab from '@/features/leads/components/LeadPageTabs/Operator2Tab';
import SellerTab from '@/features/leads/components/LeadPageTabs/SellerTab';
import ScoringTab from '@/features/leads/components/LeadPageTabs/ScoringTab';
import FieldGroup from '@/features/leads/components/LeadPageForm/FieldGroup';
import FormField from '@/features/leads/components/LeadPageForm/FormField';

import styles from './style.module.scss';
import useAlert from '@/hooks/useAlert';

export default function LeadPage() {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useFetchLeadById(id);
  const { data: lead } = data ?? {};
  const { alert } = useAlert();
  // Get current user role
  const currentUserRole = user?.['U_role'] ?? '';
  // Map role to tab key
  const roleMapping = {
    Operator1: 'operator1',
    Operator2: 'operator2',
    Seller: 'seller',
    CEO: 'scoring',
  };
  // Set default tab based on user role
  const [activeTab, setActiveTab] = useState(
    roleMapping[currentUserRole] ?? 'operator1'
  );
  // Custom breadcrumbs to show lead name instead of ID
  const customBreadcrumbs = useMemo(() => {
    if (!lead) return null;

    return [
      {
        path: '/leads',
        label: 'Leadlar',
        isMainPath: true,
      },
      {
        path: `/leads/${id}`,
        label: lead?.clientName || `${id}`,
        isLastPath: true,
      },
    ];
  }, [lead, id]);

  // Check if user can edit specific tab
  const canEditTab = (tabKey) => {
    const roleMapping = {
      operator1: 'Operator1',
      operator2: 'Operator2',
      seller: 'Seller',
      scoring: 'CEO',
    };
    return currentUserRole === roleMapping[tabKey];
  };

  // Handle successful form submission
  const handleFormSuccess = (updatedData) => {
    // Invalidate and refetch the lead data
    queryClient.invalidateQueries(['lead', id]);
    // Show success message (you   can implement toast notification here)
    alert("Lead ma'lumotlari muvaffaqiyatli yangilandi", { type: 'success' });
    console.log('Lead updated successfully:', updatedData);
  };

  const commonFields = useMemo(
    () => (
      <div className={styles['fields-grid']}>
        <FieldGroup title="Mijoz ma'lumotlari">
          <FormField
            name="clientName"
            label="Ismi"
            control={null}
            disabled={true}
            span={{ xs: 24, md: 12 }}
            defaultValue={lead?.clientName}
          />
          <FormField
            name="clientPhone"
            label="Telefon"
            control={null}
            disabled={true}
            span={{ xs: 24, md: 12 }}
            defaultValue={lead?.clientPhone}
          />
        </FieldGroup>

        <FieldGroup title="Asosiy ma'lumotlar">
          <FormField
            name="source"
            label="Manba"
            control={null}
            disabled={true}
            span={{ xs: 24, md: 8 }}
            prefix={<Globe />}
            defaultValue={lead?.source}
          />
          <FormField
            name="number"
            label="Tartib raqami"
            control={null}
            disabled={true}
            span={{ xs: 24, md: 8 }}
            defaultValue={lead?.number}
          />
          <FormField
            name="limit"
            label="Limit"
            control={null}
            disabled={true}
            span={{ xs: 24, md: 8 }}
            defaultValue={lead?.limit}
          />
          <FormField
            name="time"
            label="Yozilgan vaqt"
            control={null}
            disabled={true}
            span={{ xs: 24, md: 24 }}
            defaultValue={lead?.time}
          />
        </FieldGroup>
      </div>
    ),
    [lead]
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
            canEdit={canEditTab('operator1')}
            onSuccess={handleFormSuccess}
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
            canEdit={canEditTab('operator2')}
            onSuccess={handleFormSuccess}
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
            onSuccess={handleFormSuccess}
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
            onSuccess={handleFormSuccess}
          />
        ),
      },
    ],
    [id, lead, currentUserRole, handleFormSuccess]
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
      <Row gutter={isMobile ? 2 : 6} style={{ width: '100%', height: '100%' }}>
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
