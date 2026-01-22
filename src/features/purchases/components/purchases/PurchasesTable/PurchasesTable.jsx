import { Badge, Card, Col, Row, Typography, Skeleton } from '@/components/ui';
import styles from './styles.module.scss';
import { PurchasesRow } from './PurchasesRow';
import { PurchasesCell } from './PurchasesCell';
import { formatCurrencyUZS } from '@/features/leads/utils/deviceUtils';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 *
 * @param {React.ReactNode} children
 * @returns {JSX.Element}
 */

function PurchasesWrapper({ children }) {
  return <div className={styles.table}>{children}</div>;
}

function NoData({ title }) {
  return (
    <Row align="center" justify="center">
      <Col fullWidth fullHeight>
        <Card>
          <Typography align="center" variant="body1">
            {title ?? "📂 Ma'lumot mavjud emas"}
          </Typography>
        </Card>
      </Col>
    </Row>
  );
}

function LoadingSkeleton() {
  return (
    <PurchasesWrapper>
      {[...Array(1)].map((_, index) => (
        <PurchasesRow key={index}>
          <PurchasesCell span={2} title="Ariza raqami">
            <Skeleton width="80%" height="18px" borderRadius="6px" />
          </PurchasesCell>
          <PurchasesCell span={4} title="Yetkazib beruvchi">
            <Skeleton width="90%" height="18px" borderRadius="6px" />
          </PurchasesCell>
          <PurchasesCell span={6} title="Kategoriyalar">
            <Row direction="row" gutter={2}>
              <Col>
                <Skeleton width="80px" height="24px" borderRadius="12px" />
              </Col>
              <Col>
                <Skeleton width="100px" height="24px" borderRadius="12px" />
              </Col>
            </Row>
          </PurchasesCell>
          <PurchasesCell span={3} title="Mahsulot soni">
            <Skeleton width="60%" height="18px" borderRadius="6px" />
          </PurchasesCell>
          <PurchasesCell span={3} title="Yaratilgan sana">
            <Skeleton width="70%" height="18px" borderRadius="6px" />
          </PurchasesCell>
          <PurchasesCell span={3} title="Umumiy narx">
            <Skeleton width="85%" height="18px" borderRadius="6px" />
          </PurchasesCell>
          <PurchasesCell span={3} title="Status">
            <Skeleton width="75%" height="24px" borderRadius="12px" />
          </PurchasesCell>
        </PurchasesRow>
      ))}
    </PurchasesWrapper>
  );
}

const statusColorMap = {
  Tasdiqlangan: 'success',
  Kutilmoqda: 'warning',
  'Rad etilgan': 'danger',
  waiting: 'warning',
  declined: 'danger',
};

const categoryColorMap = {
  Telefonlar: 'info',
  'Maishiy texnika': 'warning',
  Kompyuterlar: 'success',
  Aksessuarlar: 'black',
};

export function PurchasesTable({ data, isLoading = false }) {
  const renderCategories = useCallback((categories) => {
    if (!categories?.length)
      return (
        <Col>
          <Badge color="warning">Ma'lum emas</Badge>
        </Col>
      );
    const visibleCategories =
      categories.length <= 2 ? categories : [...categories.slice(0, 2), '...'];

    return visibleCategories.map((category, index) => {
      return (
        <Col key={`${category}-${index}`}>
          <Badge color={categoryColorMap[category] || 'black'}>
            {category}
          </Badge>
        </Col>
      );
    });
  }, []);
  const navigate = useNavigate();

  const handleRowClick = useCallback(
    (contract_no) => {
      if (!contract_no) return;
      navigate(`/purchases/${contract_no}`);
    },
    [navigate]
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!data?.length) {
    return <NoData />;
  }

  return (
    <PurchasesWrapper>
      {data.map((item, index) => {
        return (
          <PurchasesRow
            key={item.id || index}
            onClick={() => handleRowClick(item?.contract_no)}
          >
            <PurchasesCell span={2} title="Ariza raqami">
              {item.contract_no}
            </PurchasesCell>
            <PurchasesCell span={4} title="Yetkazib beruvchi">
              {item.courier}
            </PurchasesCell>
            <PurchasesCell span={6} title="Kategoriyalar">
              <Row direction="row" gutter={2} align="center">
                {renderCategories(item.categories)}
              </Row>
            </PurchasesCell>
            <PurchasesCell span={3} title="Mahsulot soni">
              {item.count ? item?.count + ' dona' : '-'}
            </PurchasesCell>
            <PurchasesCell span={3} title="Yaratilgan sana">
              {item.created_at}
            </PurchasesCell>
            <PurchasesCell textColor="info" span={3} title="Umumiy narx">
              {formatCurrencyUZS(item?.total_cost)}
            </PurchasesCell>
            <PurchasesCell span={3} title="Status">
              <Badge color={statusColorMap[item.status] || 'black'}>
                {item.status}
              </Badge>
            </PurchasesCell>
          </PurchasesRow>
        );
      })}
    </PurchasesWrapper>
  );
}
