import { Meta, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Row,
  Col,
  Typography,
  Tabs,
  Navigation,
  Button,
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
import PassportUpload from '@/features/leads/components/LeadPageForm/PassportUpload';

import styles from './style.module.scss';
import useAlert from '@/hooks/useAlert';
import { formatToReadablePhoneNumber } from '@/utils/formatPhoneNumber';
import { useMutateFileUpload } from '@/hooks/data/leads/useMutateFileUpload';
import useFetchLeadFiles from '@/hooks/data/leads/useFetchLeadFiles';

export default function LeadPage() {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useFetchLeadById(id);
  const { data: lead } = data ?? {};
  const { alert } = useAlert();
  const [passportFiles, setPassportFiles] = useState([]);
  const { mutateFileUpload } = useMutateFileUpload();
  const cardCode = lead?.cardCode ?? id;
  const { data: filesData, isLoading: isLoadingFiles } = useFetchLeadFiles(
    cardCode,
    { retry: 2 }
  );
  const serverFiles = useMemo(() => {
    const list = Array.isArray(filesData) ? filesData : (filesData?.data ?? []);
    return list.map((f) => ({
      id: f._id || f.id || f.key,
      preview: f.url,
      file: null,
      source: 'server',
      fileName: f.fileName,
      mimeType: f.mimeType,
      size: f.size,
    }));
  }, [filesData]);
  const uploadValue = useMemo(
    () => [...passportFiles, ...serverFiles],
    [passportFiles, serverFiles]
  );
  // Get current user role
  const currentUserRole = user?.['U_role'] ?? '';
  // Map role to tab key
  const roleMapping = {
    Operator1: 'operator1',
    Operator2: 'operator2',
    Seller: 'seller',
    Scoring: 'scoring',
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
      scoring: 'Scoring',
    };
    if (
      Object.values(roleMapping).includes(currentUserRole) &&
      tabKey === 'all'
    )
      return true;

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
          <Row gutter={4}>
            <Col>
              <Row direction={'row'} gutter={4} wrap>
                <Col>
                  <FormField
                    name="clientName"
                    label="Ismi"
                    control={null}
                    disabled={true}
                    span={{ xs: 24, md: 12 }}
                    defaultValue={lead?.clientName}
                  />
                </Col>
                <Col>
                  <FormField
                    name="clientPhone"
                    label="Telefon"
                    control={null}
                    disabled={true}
                    span={{ xs: 24, md: 12 }}
                    defaultValue={formatToReadablePhoneNumber(
                      lead?.clientPhone,
                      true
                    )}
                  />
                </Col>
                <Col>
                  {' '}
                  <FormField
                    name="birthDate"
                    label="Tug'ilgan sana"
                    control={null}
                    disabled={true}
                    span={{ xs: 24, md: 12 }}
                    defaultValue={lead?.birthDate}
                  />
                </Col>
                <Col>
                  {' '}
                  <FormField
                    name="age"
                    label="Yosh"
                    control={null}
                    disabled={true}
                    span={{ xs: 24, md: 12 }}
                    defaultValue={lead?.age}
                  />
                </Col>
              </Row>
            </Col>
            <Col>
              <Row direction={'row'} gutter={4} wrap>
                {' '}
                <Col>
                  <FormField
                    name="passportId"
                    label="Pasport ID"
                    control={null}
                    disabled={true}
                    span={{ xs: 24, md: 8 }}
                    defaultValue={lead?.passportId}
                  />
                </Col>
                <Col>
                  <FormField
                    name="jshshir2"
                    label="JSHSHIR"
                    control={null}
                    disabled={true}
                    span={{ xs: 24, md: 8 }}
                    defaultValue={lead?.jshshir2 || lead?.jshshir}
                  />
                </Col>
                <Col>
                  <FormField
                    name="limit"
                    label="Limit"
                    control={null}
                    disabled={true}
                    span={{ xs: 24, md: 8 }}
                    defaultValue={lead?.limit}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
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
            name="time"
            label="Yozilgan vaqt"
            control={null}
            disabled={true}
            span={{ xs: 24, md: 24 }}
            defaultValue={lead?.time}
          />
        </FieldGroup>

        <FieldGroup title="Pasport rasmlari">
          <PassportUpload
            disabled={!canEditTab('all') || mutateFileUpload.isLoading}
            value={uploadValue}
            onChange={setPassportFiles}
          />
          <Row gutter={2} style={{ marginTop: '8px' }}>
            <Col>
              <Button
                variant="filled"
                onClick={() => {
                  if (!passportFiles?.length) return;
                  const formData = new FormData();
                  passportFiles.forEach((p) => {
                    if (p?.file instanceof File) {
                      formData.append('images', p.file, p.file.name);
                    }
                  });
                  const cardCodeFinal = lead?.cardCode ?? id;
                  mutateFileUpload.mutate(
                    { cardCode: cardCodeFinal, formData },
                    {
                      onSuccess: () => {
                        setPassportFiles([]);
                        queryClient.invalidateQueries(['lead', id]);
                        queryClient.invalidateQueries([
                          'lead-files',
                          cardCodeFinal,
                        ]);
                      },
                    }
                  );
                }}
                disabled={
                  !canEditTab('all') ||
                  passportFiles.length === 0 ||
                  mutateFileUpload.isLoading
                }
              >
                Hujjatlarni saqlash
              </Button>
            </Col>
          </Row>
        </FieldGroup>
      </div>
    ),
    [lead, passportFiles, mutateFileUpload?.isLoading]
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
