import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
  Row,
  Col,
  Button,
  Typography,
  Tabs,
  Input,
  Navigation,
  Card,
  SkeletonCard,
  SkeletonNavigation,
} from '@components/ui';

import useFetchLeadById from '@/hooks/data/leads/useFetchLeadById';
import useAuth from '@/hooks/useAuth';
import useIsMobile from '@/hooks/useIsMobile';
import { Globe } from '@/assets/images/icons/Icons';
import styles from './style.module.scss';

// Field mappings for each role
const FIELD_MAPPINGS = {
  Operator1: [
    'called',
    'callTime', 
    'answered',
    'callCount',
    'interested',
    'rejectionReason',
    'passportVisit',
    'jshshir',
    'idX'
  ],
  Operator2: [
    'answered2',
    'callCount2',
    'meetingDate',
    'rejectionReason2',
    'paymentInterest',
    'branch',
    'meetingHappened'
  ],
  Sotuvchi: [
    'meetingConfirmed',
    'meetingConfirmedDate',
    'consultant',
    'purchase',
    'purchaseDate',
    'saleType',
    'passportId',
    'jshshir2'
  ],
  Scoring: [
    'employeeName',
    'region',
    'district',
    'address',
    'birthDate',
    'applicationDate',
    'age',
    'score',
    'katm',
    'katmPayment',
    'paymentHistory',
    'mib',
    'mibIrresponsible',
    'aliment',
    'officialSalary',
    'finalLimit',
    'finalPercentage'
  ]
};

export default function LeadPage() {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { data, isLoading } = useFetchLeadById(id);
  const { data: lead } = data ?? {};
  
  const [activeTab, setActiveTab] = useState('operator1');
  const [formData, setFormData] = useState({});

  // Get current user role
  const currentUserRole = user?.role || 'Operator1';

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

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle save for specific tab
  const handleSave = async (tabKey) => {
    const fieldsToUpdate = FIELD_MAPPINGS[tabKey === 'operator1' ? 'Operator1' : 
                                        tabKey === 'operator2' ? 'Operator2' :
                                        tabKey === 'seller' ? 'Sotuvchi' : 'Scoring'];
    
    const updateData = {};
    fieldsToUpdate.forEach(field => {
      if (formData[field] !== undefined) {
        updateData[field] = formData[field];
      }
    });

    // TODO: Implement API call to update lead
    console.log('Saving data for tab:', tabKey, updateData);
  };

  // Check if user can edit specific tab
  const canEditTab = (tabKey) => {
    const roleMapping = {
      'operator1': 'Operator1',
      'operator2': 'Operator2', 
      'seller': 'Sotuvchi',
      'scoring': 'Scoring'
    };
    return currentUserRole === roleMapping[tabKey];
  };

  const commonFields = useMemo(
    () => (
      <div className={styles['fields-grid']}>
        <div className={styles['field-group']}>
          <Typography variant="body1" className={styles['field-label']}>
            Mijoz ma'lumotlari
          </Typography>
          <Row
            direction={{ xs: 'column', md: 'row' }}
            gutter={{ xs: 2, md: 3 }}
            wrap
          >
            <Col span={{ xs: 24, md: 12 }}>
              <Input
                label="Ismi"
                defaultValue={lead?.clientName}
                disabled
                size="large"
                variant="filled"
              />
            </Col>
            <Col span={{ xs: 24, md: 12 }}>
              <Input
                label="Telefon"
                defaultValue={lead?.clientPhone}
                disabled
                size="large"
                variant="filled"
              />
            </Col>
          </Row>
        </div>

        <div className={styles['field-group']}>
          <Typography variant="body1" className={styles['field-label']}>
            Asosiy ma'lumotlar
          </Typography>
          <Row
            direction={{ xs: 'column', md: 'row' }}
            gutter={{ xs: 2, md: 3 }}
            wrap
          >
            <Col span={{ xs: 24, md: 8 }}>
              <Input
                label="Manba"
                defaultValue={lead?.source}
                disabled
                size="large"
                variant="filled"
                prefix={<Globe />}
              />
            </Col>
            <Col span={{ xs: 24, md: 8 }}>
              <Input
                label="Tartib raqami"
                defaultValue={lead?.number}
                disabled
                size="large"
                variant="filled"
              />
            </Col>
            <Col span={{ xs: 24, md: 8 }}>
              <Input
                label="Limit"
                defaultValue={lead?.limit}
                disabled
                size="large"
                variant="filled"
              />
            </Col>
            <Col span={{ xs: 24, md: 24 }}>
              <Input
                label="Yozilgan vaqt"
                defaultValue={lead?.time}
                disabled
                size="large"
                variant="filled"
              />
            </Col>
          </Row>
        </div>
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
          <div className={styles['tab-content']}>
            <div className={styles['tab-header']}>
              <Typography variant="h6" className={styles['tab-title']}>
                Operator1 Ma'lumotlari
              </Typography>
              <Button
                variant="filled"
                size="large"
                onClick={() => handleSave('operator1')}
                disabled={!canEditTab('operator1')}
                className={styles['tab-save-button']}
              >
                Saqlash
              </Button>
            </div>

            <div className={styles['field-group']}>
              <Typography variant="body1" className={styles['field-label']}>
                Qo'ng'iroq ma'lumotlari
              </Typography>
              <Row
                direction={{ xs: 'column', md: 'row' }}
                gutter={{ xs: 2, md: 3 }}
                wrap
              >
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Qo'ng'iroq qilindimi?"
                    defaultValue={lead?.called ? 'Ha' : "Yo'q"}
                    disabled={!canEditTab('operator1')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('called', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Qo'ng'iroq vaqti"
                    defaultValue={lead?.callTime}
                    disabled={!canEditTab('operator1')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('callTime', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Javob berildimi?"
                    defaultValue={lead?.answered ? 'Ha' : "Yo'q"}
                    disabled={!canEditTab('operator1')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('answered', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Qo'ng'iroqlar soni"
                    defaultValue={lead?.callCount}
                    disabled={!canEditTab('operator1')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('callCount', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Qiziqish"
                    defaultValue={lead?.interested}
                    disabled={!canEditTab('operator1')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('interested', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Rad etish sababi"
                    defaultValue={lead?.rejectionReason}
                    disabled={!canEditTab('operator1')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('rejectionReason', e.target.value)}
                  />
                </Col>
              </Row>
            </div>

            <div className={styles['field-group']}>
              <Typography variant="body1" className={styles['field-label']}>
                Shaxsiy hujjatlar
              </Typography>
              <Row
                direction={{ xs: 'column', md: 'row' }}
                gutter={{ xs: 2, md: 3 }}
                wrap
              >
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Pasport/Tashrif"
                    defaultValue={lead?.passportVisit}
                    disabled={!canEditTab('operator1')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('passportVisit', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="JSHSHIR"
                    defaultValue={lead?.jshshir}
                    disabled={!canEditTab('operator1')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('jshshir', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="ID X"
                    defaultValue={lead?.idX}
                    disabled={!canEditTab('operator1')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('idX', e.target.value)}
                  />
                </Col>
              </Row>
            </div>
          </div>
        ),
      },
      {
        key: 'operator2',
        label: 'Operator2',
        content: (
          <div className={styles['tab-content']}>
            <div className={styles['tab-header']}>
              <Typography variant="h6" className={styles['tab-title']}>
                Operator2 Ma'lumotlari
              </Typography>
              <Button
                variant="filled"
                size="large"
                onClick={() => handleSave('operator2')}
                disabled={!canEditTab('operator2')}
                className={styles['tab-save-button']}
              >
                Saqlash
              </Button>
            </div>

            <div className={styles['field-group']}>
              <Typography variant="body1" className={styles['field-label']}>
                Qo'ng'iroq ma'lumotlari
              </Typography>
              <Row
                direction={{ xs: 'column', md: 'row' }}
                gutter={{ xs: 2, md: 3 }}
                wrap
              >
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Javob oldimi?"
                    defaultValue={lead?.answered2 ? 'Ha' : "Yo'q"}
                    disabled={!canEditTab('operator2')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('answered2', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Qo'ng'iroqlar soni"
                    defaultValue={lead?.callCount2}
                    disabled={!canEditTab('operator2')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('callCount2', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Ikkinchi rad sababi"
                    defaultValue={lead?.rejectionReason2}
                    disabled={!canEditTab('operator2')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('rejectionReason2', e.target.value)}
                  />
                </Col>
              </Row>
            </div>

            <div className={styles['field-group']}>
              <Typography variant="body1" className={styles['field-label']}>
                Uchrashuv ma'lumotlari
              </Typography>
              <Row
                direction={{ xs: 'column', md: 'row' }}
                gutter={{ xs: 2, md: 3 }}
                wrap
              >
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Uchrashuv sanasi"
                    defaultValue={lead?.meetingDate}
                    disabled={!canEditTab('operator2')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('meetingDate', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Filial"
                    defaultValue={lead?.branch}
                    disabled={!canEditTab('operator2')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('branch', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Uchrashuv bo'ldimi?"
                    defaultValue={lead?.meetingHappened}
                    disabled={!canEditTab('operator2')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('meetingHappened', e.target.value)}
                  />
                </Col>
              </Row>
            </div>

            <div className={styles['field-group']}>
              <Typography variant="body1" className={styles['field-label']}>
                To'lov ma'lumotlari
              </Typography>
              <Row
                direction={{ xs: 'column', md: 'row' }}
                gutter={{ xs: 2, md: 3 }}
                wrap
              >
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="To'lov turi"
                    defaultValue={lead?.paymentInterest}
                    disabled={!canEditTab('operator2')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('paymentInterest', e.target.value)}
                  />
                </Col>
              </Row>
            </div>
          </div>
        ),
      },
      {
        key: 'seller',
        label: 'Sotuvchi',
        content: (
          <div className={styles['tab-content']}>
            <div className={styles['tab-header']}>
              <Typography variant="h6" className={styles['tab-title']}>
                Sotuvchi Ma'lumotlari
              </Typography>
              <Button
                variant="filled"
                size="large"
                onClick={() => handleSave('seller')}
                disabled={!canEditTab('seller')}
                className={styles['tab-save-button']}
              >
                Saqlash
              </Button>
            </div>

            <div className={styles['field-group']}>
              <Typography variant="body1" className={styles['field-label']}>
                Uchrashuv ma'lumotlari
              </Typography>
              <Row
                direction={{ xs: 'column', md: 'row' }}
                gutter={{ xs: 2, md: 3 }}
                wrap
              >
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Uchrashuv tasdiqlandi"
                    defaultValue={lead?.meetingConfirmed ? 'Ha' : "Yo'q"}
                    disabled={!canEditTab('seller')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('meetingConfirmed', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Tasdiqlangan sana"
                    defaultValue={lead?.meetingConfirmedDate}
                    disabled={!canEditTab('seller')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('meetingConfirmedDate', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Maslahatchi"
                    defaultValue={lead?.consultant}
                    disabled={!canEditTab('seller')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('consultant', e.target.value)}
                  />
                </Col>
              </Row>
            </div>

            <div className={styles['field-group']}>
              <Typography variant="body1" className={styles['field-label']}>
                Xarid ma'lumotlari
              </Typography>
              <Row
                direction={{ xs: 'column', md: 'row' }}
                gutter={{ xs: 2, md: 3 }}
                wrap
              >
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Xarid amalga oshdimi?"
                    defaultValue={lead?.purchase ? 'Ha' : "Yo'q"}
                    disabled={!canEditTab('seller')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('purchase', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Xarid sanasi"
                    defaultValue={lead?.purchaseDate}
                    disabled={!canEditTab('seller')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Savdo turi"
                    defaultValue={lead?.saleType}
                    disabled={!canEditTab('seller')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('saleType', e.target.value)}
                  />
                </Col>
              </Row>
            </div>

            <div className={styles['field-group']}>
              <Typography variant="body1" className={styles['field-label']}>
                Hujjat ma'lumotlari
              </Typography>
              <Row
                direction={{ xs: 'column', md: 'row' }}
                gutter={{ xs: 2, md: 3 }}
                wrap
              >
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Pasport ID"
                    defaultValue={lead?.passportId}
                    disabled={!canEditTab('seller')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('passportId', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="JSHSHIR (2)"
                    defaultValue={lead?.jshshir2}
                    disabled={!canEditTab('seller')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('jshshir2', e.target.value)}
                  />
                </Col>
              </Row>
            </div>
          </div>
        ),
      },
      {
        key: 'scoring',
        label: 'Tekshirish xodimi',
        content: (
          <div className={styles['tab-content']}>
            <div className={styles['tab-header']}>
              <Typography variant="h6" className={styles['tab-title']}>
                Tekshirish Xodimi Ma'lumotlari
              </Typography>
              <Button
                variant="filled"
                size="large"
                onClick={() => handleSave('scoring')}
                disabled={!canEditTab('scoring')}
                className={styles['tab-save-button']}
              >
                Saqlash
              </Button>
            </div>

            <div className={styles['field-group']}>
              <Typography variant="body1" className={styles['field-label']}>
                Hodim ma'lumotlari
              </Typography>
              <Row
                direction={{ xs: 'column', md: 'row' }}
                gutter={{ xs: 2, md: 3 }}
                wrap
              >
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Hodim F.I.O"
                    defaultValue={lead?.employeeName}
                    disabled={!canEditTab('scoring')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('employeeName', e.target.value)}
                  />
                </Col>
              </Row>
            </div>

            <div className={styles['field-group']}>
              <Typography variant="body1" className={styles['field-label']}>
                Manzil ma'lumotlari
              </Typography>
              <Row
                direction={{ xs: 'column', md: 'row' }}
                gutter={{ xs: 2, md: 3 }}
                wrap
              >
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Viloyat"
                    defaultValue={lead?.region}
                    disabled={!canEditTab('scoring')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('region', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Tuman"
                    defaultValue={lead?.district}
                    disabled={!canEditTab('scoring')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('district', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Manzil"
                    defaultValue={lead?.address}
                    disabled={!canEditTab('scoring')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </Col>
              </Row>
            </div>

            <div className={styles['field-group']}>
              <Typography variant="body1" className={styles['field-label']}>
                Shaxsiy ma'lumotlar
              </Typography>
              <Row
                direction={{ xs: 'column', md: 'row' }}
                gutter={{ xs: 2, md: 3 }}
                wrap
              >
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Tug'ilgan sana"
                    defaultValue={lead?.birthDate}
                    disabled={!canEditTab('scoring')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Ariza sanasi"
                    defaultValue={lead?.applicationDate}
                    disabled={!canEditTab('scoring')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('applicationDate', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Yosh"
                    defaultValue={lead?.age}
                    disabled={!canEditTab('scoring')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('age', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Ball (score)"
                    defaultValue={lead?.score}
                    disabled={!canEditTab('scoring')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('score', e.target.value)}
                  />
                </Col>
              </Row>
            </div>

            <div className={styles['field-group']}>
              <Typography variant="body1" className={styles['field-label']}>
                KATM va To'lov ma'lumotlari
              </Typography>
              <Row
                direction={{ xs: 'column', md: 'row' }}
                gutter={{ xs: 2, md: 3 }}
                wrap
              >
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="KATM"
                    defaultValue={lead?.katm}
                    disabled={!canEditTab('scoring')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('katm', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="KATM to'lov"
                    defaultValue={lead?.katmPayment}
                    disabled={!canEditTab('scoring')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('katmPayment', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="To'lov tarixi"
                    defaultValue={lead?.paymentHistory}
                    disabled={!canEditTab('scoring')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('paymentHistory', e.target.value)}
                  />
                </Col>
              </Row>
            </div>

            <div className={styles['field-group']}>
              <Typography variant="body1" className={styles['field-label']}>
                MIB va Boshqa ma'lumotlar
              </Typography>
              <Row
                direction={{ xs: 'column', md: 'row' }}
                gutter={{ xs: 2, md: 3 }}
                wrap
              >
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="MIB"
                    defaultValue={lead?.mib}
                    disabled={!canEditTab('scoring')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('mib', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="MIB mas'uliyatsiz"
                    defaultValue={lead?.mibIrresponsible}
                    disabled={!canEditTab('scoring')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('mibIrresponsible', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Aliment"
                    defaultValue={lead?.aliment}
                    disabled={!canEditTab('scoring')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('aliment', e.target.value)}
                  />
                </Col>
              </Row>
            </div>

            <div className={styles['field-group']}>
              <Typography variant="body1" className={styles['field-label']}>
                Yakuniy ma'lumotlar
              </Typography>
              <Row
                direction={{ xs: 'column', md: 'row' }}
                gutter={{ xs: 2, md: 3 }}
                wrap
              >
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Rasmiy oylik"
                    defaultValue={lead?.officialSalary}
                    disabled={!canEditTab('scoring')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('officialSalary', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Yakuniy limit"
                    defaultValue={lead?.finalLimit}
                    disabled={!canEditTab('scoring')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('finalLimit', e.target.value)}
                  />
                </Col>
                <Col span={{ xs: 24, md: 8 }}>
                  <Input
                    label="Yakuniy foiz"
                    defaultValue={lead?.finalPercentage}
                    disabled={!canEditTab('scoring')}
                    size="large"
                    variant="filled"
                    onChange={(e) => handleInputChange('finalPercentage', e.target.value)}
                  />
                </Col>
              </Row>
            </div>
          </div>
        ),
      },
    ],
    [lead, formData, currentUserRole]
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
