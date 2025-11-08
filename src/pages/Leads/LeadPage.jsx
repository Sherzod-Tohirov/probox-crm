import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
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
import useMutateLead from '@/hooks/data/leads/useMutateLead';
import useAuth from '@/hooks/useAuth';
import useIsMobile from '@/hooks/useIsMobile';
import { useForm } from 'react-hook-form';

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
import useFetchExecutors from '@/hooks/data/useFetchExecutors';
import selectOptionsCreator from '@/utils/selectOptionsCreator';
import { findExecutor } from '@/utils/findExecutorById';
import formatterCurrency from '@/utils/formatterCurrency';
import hasRole from '@/utils/hasRole';
import { statusOptions } from '@/features/leads/utils/options';

const regionOptions = [
  { value: 'Toshkent shahar', label: 'Toshkent shahar' },
  { value: 'Toshkent', label: 'Toshkent viloyati' },
  { value: "Farg'ona", label: "Farg'ona viloyati" },
  { value: 'Namangan', label: 'Namangan viloyati' },
  { value: 'Andijon', label: 'Andijon viloyati' },
  { value: 'Sirdaryo', label: 'Sirdaryo viloyati' },
  { value: 'Jizzax', label: 'Jizzax viloyati' },
  { value: 'Samarqand', label: 'Samarqand viloyati' },
  { value: 'Qashqadaryo', label: 'Qashqadaryo viloyati' },
  { value: 'Surxondaryo', label: 'Surxondaryo viloyati' },
  { value: 'Navoiy', label: 'Navoiy viloyati' },
  { value: 'Buxoro', label: 'Buxoro viloyati' },
  { value: 'Xorazm', label: 'Xorazm viloyati' },
  { value: "Qoraqalpog'iston", label: "Qoraqalpog'iston viloyati" },
];

export default function LeadPage() {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: executors = [] } = useFetchExecutors({
    include_role: ['Operator1', 'Operator2', 'Seller', 'Scoring', 'OperatorM'],
  });
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
  const isOperatorManager = currentUserRole === 'OperatorM';
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

  // Address form state (General Information)
  const addressForm = useForm({
    defaultValues: {
      region: lead?.region || '',
      district: lead?.district || '',
      address: lead?.address || '',
    },
  });
  const {
    control: addressControl,
    handleSubmit: handleAddressSubmit,
    reset: resetAddress,
  } = addressForm;

  useEffect(() => {
    if (!lead) return;
    resetAddress({
      region: lead?.region || '',
      district: lead?.district || '',
      address: lead?.address || '',
    });
  }, [lead, resetAddress]);

  const assignmentsForm = useForm({
    defaultValues: {
      operator: lead?.operator ? String(lead.operator) : '',
      operator2: lead?.operator2 ? String(lead.operator2) : '',
    },
  });
  const {
    control: assignmentsControl,
    handleSubmit: handleAssignmentsSubmit,
    reset: resetAssignments,
  } = assignmentsForm;
  const commentsForm = useForm({
    defaultValues: {
      comment: lead?.comment || '',
    },
  });
  const {
    control: commentsControl,
    handleSubmit: handleCommentsSubmit,
    reset: resetComments,
  } = commentsForm;
  const statusForm = useForm({
    defaultValues: {
      status: lead?.status || '',
    },
  });
  const {
    control: statusControl,
    handleSubmit: handleStatusSubmit,
    reset: resetStatus,
  } = statusForm;
  const isStatusDirty = statusForm.formState.isDirty;
  const isCommentsDirty = commentsForm.formState.isDirty;
  const isAssignmentsDirty = assignmentsForm.formState.isDirty;
  // Update this useEffect to properly handle the form reset
  useEffect(() => {
    if (!lead) return;

    const defaultValues = {
      operator: lead?.operator ? String(lead.operator) : '',
      operator2: lead?.operator2 ? String(lead.operator2) : '',
    };

    // Reset the form with the new default values
    resetAssignments(defaultValues, {
      keepDirty: false, // This ensures the form is marked as not dirty after reset
    });
  }, [lead, resetAssignments]);

  useEffect(() => {
    if (!lead) return;
    resetComments({
      comment: lead?.comment || '',
    });
  }, [lead, resetComments]);

  useEffect(() => {
    if (!lead) return;
    resetStatus({
      status: lead?.status || '',
    });
  }, [lead, resetStatus]);

  const updateLead = useMutateLead(id, {
    onSuccess: (updated) => {
      handleFormSuccess(updated);
    },
  });

  // Check if user can edit specific tab
  const canEditTab = (tabKey) => {
    const roleMapping = {
      operator1: 'Operator1',
      operator2: 'Operator2',
      seller: 'Seller',
      scoring: 'Scoring',
      operatorM: 'OperatorM',
    };
    if (
      Object.values(roleMapping).includes(currentUserRole) &&
      tabKey === 'all'
    )
      return true;

    return currentUserRole === roleMapping[tabKey];
  };

  const canEditAddress = useMemo(() => {
    return (
      canEditTab('operator1') ||
      canEditTab('operator2') ||
      canEditTab('operatorM') ||
      canEditTab('seller') ||
      canEditTab('scoring')
    );
  }, [currentUserRole]);

  const canEditStatus = hasRole(currentUserRole, ['OperatorM']);

  const operator1Options = useMemo(() => {
    const operator1Executors = executors.filter(
      (executor) => String(executor.U_role) === 'Operator1'
    );
    return selectOptionsCreator(operator1Executors, {
      label: 'SlpName',
      value: 'SlpCode',
      includeEmpty: true,
      isEmptySelectable: true,
    });
  }, [executors]);
  const operator2Options = useMemo(() => {
    const operator2Executors = executors.filter(
      (executor) => String(executor.U_role) === 'Operator2'
    );
    return selectOptionsCreator(operator2Executors, {
      label: 'SlpName',
      value: 'SlpCode',
      includeEmpty: true,
      isEmptySelectable: true,
    });
  }, [executors]);
  const operatorName = useMemo(
    () => findExecutor(executors, lead?.operator)?.SlpName || '-',
    [executors, lead?.operator]
  );

  const operator2Name = useMemo(
    () => findExecutor(executors, lead?.operator2)?.SlpName || '-',
    [executors, lead?.operator2]
  );

  const onSaveAddress = handleAddressSubmit((values) => {
    const payload = {
      region: values?.region ?? '',
      district: values?.district ?? '',
      address: values?.address ?? '',
    };
    updateLead.mutate(payload);
  });

  const onSaveAssignments = handleAssignmentsSubmit((values) => {
    const payload = {
      operator: String(values?.operator) || '',
      operator2: String(values?.operator2) || '',
    };
    updateLead.mutate(payload);
  });

  const onSaveComment = handleCommentsSubmit((values) => {
    const payload = {
      comment: values?.comment ?? '',
    };
    updateLead.mutate(payload);
  });

  const onSaveStatus = handleStatusSubmit((values) => {
    const payload = {
      status: values?.status ?? '',
    };
    updateLead.mutate(payload);
  });

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

  // Handle successful form submission
  const handleFormSuccess = (updatedData) => {
    // Invalidate and refetch the lead data
    queryClient.invalidateQueries(['lead', id]);
    // Show success message (you   can implement toast notification here)
    alert("Lead ma'lumotlari muvaffaqiyatli yangilandi", { type: 'success' });
    console.log('Lead updated successfully:', updatedData);
  };

  const commonFields = (
    <div className={styles['fields-grid']}>
      <FieldGroup title={"Status ma'lumotlari"}>
        <form onSubmit={onSaveStatus} style={{ width: '100%' }}>
          <Row gutter={4}>
            <Col>
              <FormField
                name="status"
                label="Status"
                type="select"
                control={statusControl}
                disabled={!canEditStatus}
                span={{ xs: 24, md: 12 }}
                placeholderOption={true}
                options={statusOptions}
                defaultValue={lead?.status}
              />
            </Col>
            <Col>
              {canEditStatus && (
                <Row>
                  <Col>
                    <Button
                      disabled={!isStatusDirty}
                      variant="filled"
                      type="submit"
                    >
                      Statusni saqlash
                    </Button>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        </form>
      </FieldGroup>
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
                  name="finalLimit"
                  label="Yakuniy limit"
                  control={null}
                  disabled={true}
                  span={{ xs: 24, md: 8 }}
                  defaultValue={
                    lead?.finalLimit ? formatterCurrency(lead?.finalLimit) : ''
                  }
                  iconText="so'm"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </FieldGroup>

      <FieldGroup title="Manzil ma'lumotlari">
        <FormField
          name="region"
          label="Viloyat"
          control={addressControl}
          type="select"
          options={regionOptions}
          placeholderOption={true}
          disabled={!canEditAddress}
        />
        <FormField
          name="district"
          label="Tuman"
          control={addressControl}
          disabled={!canEditAddress}
        />
        <FormField
          name="address"
          label="Manzil"
          control={addressControl}
          disabled={!canEditAddress}
        />
        <Row gutter={2} style={{ marginTop: '8px' }}>
          <Col>
            <Button
              variant="filled"
              onClick={onSaveAddress}
              disabled={!canEditAddress || updateLead.isPending}
            >
              Manzilni saqlash
            </Button>
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
      <FieldGroup title="Biriktirilgan xodimlar">
        {isOperatorManager ? (
          <form onSubmit={onSaveAssignments} style={{ width: '100%' }}>
            <Row direction="row" gutter={2} wrap>
              <Col span={{ xs: 24, md: 8 }}>
                <FormField
                  name="operator"
                  label="Operator 1"
                  control={assignmentsControl}
                  type="select"
                  options={operator1Options}
                  disabled={!isOperatorManager}
                />
              </Col>
              <Col span={{ xs: 24, md: 8 }}>
                <FormField
                  name="operator2"
                  label="Operator 2"
                  control={assignmentsControl}
                  type="select"
                  options={operator2Options}
                  disabled={!isOperatorManager}
                />
              </Col>
              <Col span={{ xs: 24, md: 8 }}>
                <FormField
                  name="seller"
                  label="Sotuvchi"
                  control={null}
                  disabled
                  defaultValue={findExecutor(executors, lead?.seller)?.SlpName}
                />
              </Col>
              <Col span={{ xs: 24, md: 8 }}>
                <FormField
                  name="scoring"
                  label="Scoring"
                  control={null}
                  disabled
                  defaultValue={findExecutor(executors, lead?.scoring)?.SlpName}
                />
              </Col>
            </Row>
            <Row gutter={2} style={{ marginTop: '16px' }}>
              <Col>
                <Button
                  variant="filled"
                  type="submit"
                  disabled={!isAssignmentsDirty}
                >
                  Biriktirishlarni saqlash
                </Button>
              </Col>
            </Row>
          </form>
        ) : (
          <>
            <FormField
              name="operator"
              label="Operator 1"
              control={null}
              disabled
              span={{ xs: 24, md: 8 }}
              defaultValue={operatorName}
            />
            <FormField
              name="operator2"
              label="Operator 2"
              control={null}
              disabled
              span={{ xs: 24, md: 8 }}
              defaultValue={operator2Name}
            />
            <FormField
              name="seller"
              label="Sotuvchi"
              control={null}
              disabled
              span={{ xs: 24, md: 8 }}
              defaultValue={findExecutor(executors, lead?.seller)?.SlpName}
            />
            <FormField
              name="scoring"
              label="Scoring"
              control={null}
              disabled
              span={{ xs: 24, md: 8 }}
              defaultValue={findExecutor(executors, lead?.scoring)?.SlpName}
            />
          </>
        )}
      </FieldGroup>

      <FieldGroup title="Izoh">
        <form onSubmit={onSaveComment} style={{ width: '100%' }}>
          <Row direction="row" gutter={2} wrap>
            <Col span={{ xs: 24, md: 24 }}>
              <FormField
                name="comment"
                label="Izoh qoldirish"
                control={commentsControl}
                type="textarea"
                span={{ xs: 24, md: 24 }}
              />
            </Col>
          </Row>
          <Row gutter={2} style={{ marginTop: '8px' }}>
            <Col>
              <Button
                variant="filled"
                type="submit"
                disabled={!isCommentsDirty}
              >
                Izohni saqlash
              </Button>
            </Col>
          </Row>
        </form>
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
            canEdit={canEditTab('operator2') || canEditTab('operatorM')}
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
