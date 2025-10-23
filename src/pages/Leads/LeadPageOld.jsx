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
import useIsMobile from '@/hooks/useIsMobile';
import styles from './style.module.scss';

export default function LeadPage() {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const { data, isLoading } = useFetchLeadById(id);
  const { data: lead } = data ?? {};
  console.log(lead, 'lead');
  const [activeTab, setActiveTab] = useState('operator1');

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
                size="lg"
              />
            </Col>
            <Col span={{ xs: 24, md: 12 }}>
              <Input
                label="Telefon"
                defaultValue={lead?.clientPhone}
                disabled
                size="lg"
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
                size="lg"
              />
            </Col>
            <Col span={{ xs: 24, md: 8 }}>
              <Input
                label="Tartib raqami"
                defaultValue={lead?.number}
                disabled
                size="lg"
              />
            </Col>
            <Col span={{ xs: 24, md: 8 }}>
              <Input
                label="Limit"
                defaultValue={lead?.limit}
                disabled
                size="lg"
              />
            </Col>
            <Col span={{ xs: 24, md: 24 }}>
              <Input
                label="Yozilgan vaqt"
                defaultValue={lead?.time}
                disabled
                size="lg"
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
            <div className={styles['field-group']}>
              <Typography variant="body1" className={styles['field-label']}>
                Operator ma'lumotlari
              </Typography>
              <Row
                direction={{ xs: 'column', md: 'row' }}
                gutter={{ xs: 2, md: 3 }}
                wrap
              >
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="Operator 1"
                    defaultValue={lead?.operator}
                    size="lg"
                  />
                </Col>
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="Qo'ng'iroqlar soni"
                    defaultValue={lead?.callCount}
                    size="lg"
                  />
                </Col>
              </Row>
            </div>

            <div className={styles['field-group']}>
              <Typography variant="body1" className={styles['field-label']}>
                Qo'ng'iroq holati
              </Typography>
              <Row
                direction={{ xs: 'column', md: 'row' }}
                gutter={{ xs: 2, md: 3 }}
                wrap
              >
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="Qo'ng'iroq qilindimi?"
                    defaultValue={lead?.called ? 'Ha' : "Yo'q"}
                    size="lg"
                  />
                </Col>
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="Javob berildimi?"
                    defaultValue={lead?.answered ? 'Ha' : "Yo'q"}
                    size="lg"
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
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="JSHSHIR"
                    defaultValue={lead?.jshshir}
                    size="lg"
                  />
                </Col>
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="Pasport/Tashrif"
                    defaultValue={lead?.passportVisit}
                    size="lg"
                  />
                </Col>
                <Col span={{ xs: 24, md: 24 }}>
                  <Input
                    label="Rad etish sababi"
                    defaultValue={lead?.rejectionReason}
                    size="lg"
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
            <div className={styles['field-group']}>
              <Typography variant="body1" className={styles['field-label']}>
                Operator ma'lumotlari
              </Typography>
              <Row
                direction={{ xs: 'column', md: 'row' }}
                gutter={{ xs: 2, md: 3 }}
                wrap
              >
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="Operator 2"
                    defaultValue={lead?.operator2}
                    size="lg"
                  />
                </Col>
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="Qo'ng'iroqlar soni"
                    defaultValue={lead?.callCount2}
                    size="lg"
                  />
                </Col>
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="Javob oldimi?"
                    defaultValue={lead?.answered2 ? 'Ha' : "Yo'q"}
                    size="lg"
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
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="Uchrashuv sanasi"
                    defaultValue={lead?.meetingDate}
                    size="lg"
                  />
                </Col>
                <Col span={{ xs: 24, md: 12 }}>
                  <Input label="Filial" defaultValue={lead?.branch} size="lg" />
                </Col>
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="To'lov turi"
                    defaultValue={lead?.paymentInterest}
                    size="lg"
                  />
                </Col>
              </Row>
            </div>

            <div className={styles['field-group']}>
              <Typography variant="body1" className={styles['field-label']}>
                Qo'shimcha ma'lumotlar
              </Typography>
              <Row
                direction={{ xs: 'column', md: 'row' }}
                gutter={{ xs: 2, md: 3 }}
                wrap
              >
                <Col span={{ xs: 24, md: 24 }}>
                  <Input
                    label="Ikkinchi rad sababi"
                    defaultValue={lead?.rejectionReason2}
                    size="lg"
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
            <div className={styles['field-group']}>
              <Typography variant="body1" className={styles['field-label']}>
                Uchrashuv ma'lumotlari
              </Typography>
              <Row
                direction={{ xs: 'column', md: 'row' }}
                gutter={{ xs: 2, md: 3 }}
                wrap
              >
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="Uchrashuv tasdiqlandi"
                    defaultValue={lead?.meetingConfirmed ? 'Ha' : "Yo'q"}
                    size="lg"
                  />
                </Col>
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="Tasdiqlangan sana"
                    defaultValue={lead?.meetingConfirmedDate}
                    size="lg"
                  />
                </Col>
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="Maslahatchi"
                    defaultValue={lead?.consultant}
                    size="lg"
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
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="Xarid amalga oshdimi?"
                    defaultValue={lead?.purchase ? 'Ha' : "Yo'q"}
                    size="lg"
                  />
                </Col>
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="Xarid sanasi"
                    defaultValue={lead?.purchaseDate}
                    size="lg"
                  />
                </Col>
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="Savdo turi"
                    defaultValue={lead?.saleType}
                    size="lg"
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
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="Pasport ID"
                    defaultValue={lead?.passportId}
                    size="lg"
                  />
                </Col>
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="JSHSHIR (2)"
                    defaultValue={lead?.jshshir2}
                    size="lg"
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
            <div className={styles['field-group']}>
              <Typography variant="body1" className={styles['field-label']}>
                Hodim ma'lumotlari
              </Typography>
              <Row
                direction={{ xs: 'column', md: 'row' }}
                gutter={{ xs: 2, md: 3 }}
                wrap
              >
                <Col span={{ xs: 24, md: 24 }}>
                  <Input
                    label="Hodim F.I.O"
                    defaultValue={lead?.employeeName}
                    size="lg"
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
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="Viloyat"
                    defaultValue={lead?.region}
                    size="lg"
                  />
                </Col>
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="Tuman"
                    defaultValue={lead?.district}
                    size="lg"
                  />
                </Col>
                <Col span={{ xs: 24, md: 24 }}>
                  <Input
                    label="Manzil"
                    defaultValue={lead?.address}
                    size="lg"
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
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="Tug'ilgan sana"
                    defaultValue={lead?.birthDate}
                    size="lg"
                  />
                </Col>
                <Col span={{ xs: 24, md: 12 }}>
                  <Input label="Yosh" defaultValue={lead?.age} size="lg" />
                </Col>
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="Ariza sanasi"
                    defaultValue={lead?.applicationDate}
                    size="lg"
                  />
                </Col>
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="Ball (score)"
                    defaultValue={lead?.score}
                    size="lg"
                  />
                </Col>
              </Row>
            </div>

            <div className={styles['field-group']}>
              <Typography variant="body1" className={styles['field-label']}>
                Moliyaviy ma'lumotlar
              </Typography>
              <Row
                direction={{ xs: 'column', md: 'row' }}
                gutter={{ xs: 2, md: 3 }}
                wrap
              >
                <Col span={{ xs: 24, md: 12 }}>
                  <Input label="KATM" defaultValue={lead?.katm} size="lg" />
                </Col>
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="KATM to'lov"
                    defaultValue={lead?.katmPayment}
                    size="lg"
                  />
                </Col>
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="Rasmiy oylik"
                    defaultValue={lead?.officialSalary}
                    size="lg"
                  />
                </Col>
                <Col span={{ xs: 24, md: 12 }}>
                  <Input
                    label="Yakuniy limit"
                    defaultValue={lead?.finalLimit}
                    size="lg"
                  />
                </Col>
                <Col span={{ xs: 24, md: 24 }}>
                  <Input
                    label="Yakuniy foiz"
                    defaultValue={lead?.finalPercentage}
                    size="lg"
                  />
                </Col>
              </Row>
            </div>
          </div>
        ),
      },
    ],
    [lead]
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
                {/* Loading Navigation with Breadcrumb */}
                <SkeletonNavigation />
              </Col>
              <Col>
                <Button
                  variant="filled"
                  size="lg"
                  className={styles['save-button']}
                  disabled
                >
                  Saqlash
                </Button>
              </Col>
            </Row>
          </Col>

          <Col fullWidth>
            <Row gutter={isMobile ? 4 : 6}>
              {/* Loading Cards */}
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

  // Alternative: Simple centered spinner loading
  // if (isLoading) {
  //   return (
  //     <div style={{
  //       display: 'flex',
  //       justifyContent: 'center',
  //       alignItems: 'center',
  //       height: '400px',
  //       flexDirection: 'column',
  //       gap: '16px'
  //     }}>
  //       <Spinner size="large" />
  //       <Typography variant="h5">Yuklanmoqda...</Typography>
  //     </div>
  //   );
  // }

  return (
    <>
      <Row gutter={isMobile ? 2 : 6} style={{ width: '100%', height: '100%' }}>
        <Col fullWidth>
          <Row
            direction={{ xs: 'column', md: 'row' }}
            gutter={{ xs: 2, md: 3 }}
          >
            <Col flexGrow>
              {/* Navigation with Breadcrumb */}
              <Navigation
                fallbackBackPath="/leads"
                customBreadcrumbs={customBreadcrumbs}
              />
            </Col>
            <Col>
              <Button
                variant="filled"
                size="lg"
                className={styles['save-button']}
              >
                Saqlash
              </Button>
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
