import { Badge, Card, Col, Row, Typography, Skeleton } from '@/components/ui';
import styles from './styles.module.scss';
import { PurchasesRow } from './PurchasesRow';
import { PurchasesCell } from './PurchasesCell';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import formatDate from '@/utils/formatDate';
import formatterCurrency from '@/utils/formatterCurrency';
import StatusBadge from '../../purchase/StatusBadge';
import { useSelector } from 'react-redux';

/**
 *
 * @param {React.ReactNode} children
 * @returns {JSX.Element}
 */

function PurchasesWrapper({ children }) {
  return <div className={styles.wrapper}>{children}</div>;
}

function PurchaseTableWrapper({ children }) {
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

function LoadingSkeleton({ pageSize }) {
  return (
    <PurchasesWrapper>
      <PurchaseTableWrapper>
        {[...Array(pageSize)].map((_, index) => (
          <PurchasesRow key={index}>
            <PurchasesCell span={2} title="Ariza raqami">
              <Skeleton width="85%" height="24px" borderRadius="6px" />
            </PurchasesCell>
            <PurchasesCell span={4} title="Yetkazib beruvchi">
              <Skeleton width="95%" height="24px" borderRadius="6px" />
            </PurchasesCell>
            <PurchasesCell span={6} title="Kategoriyalar">
              <Row direction="row" gutter={2}>
                <Col>
                  <Skeleton width="90px" height="24px" borderRadius="6px" />
                </Col>
                <Col>
                  <Skeleton width="110px" height="24px" borderRadius="6px" />
                </Col>
              </Row>
            </PurchasesCell>
            <PurchasesCell span={3} title="Mahsulot soni">
              <Skeleton width="70%" height="24px" borderRadius="6px" />
            </PurchasesCell>
            <PurchasesCell span={3} title="Yaratilgan sana">
              <Skeleton width="80%" height="24px" borderRadius="6px" />
            </PurchasesCell>
            <PurchasesCell span={3} title="Umumiy narx">
              <Skeleton width="90%" height="24px" borderRadius="6px" />
            </PurchasesCell>
            <PurchasesCell span={3} title="Status">
              <Skeleton width="85%" height="24px" borderRadius="6px" />
            </PurchasesCell>
          </PurchasesRow>
        ))}
      </PurchaseTableWrapper>
    </PurchasesWrapper>
  );
}

const categoryColorMap = {
  iPhone: 'info',
  'Maishiy texnika': 'warning',
  Kompyuterlar: 'success',
  Aksessuarlar: 'black',
};

export function PurchasesTable({ data, isLoading = false }) {
  const { pageSize } = useSelector((state) => state.page.purchases);
  const renderCategories = useCallback((groups) => {
    if (!groups?.length)
      return (
        <Col>
          <Badge color="warning">Ma'lum emas</Badge>
        </Col>
      );
    const categories = groups.map((category) => category.name);
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
    (item) => {
      if (!item?.docNum || !item?.docEntry || !item?.source) return;
      navigate(`/purchases/${item.docNum}`, {
        state: {
          docEntry: item.docEntry,
          source: item.source,
          status: item?.status,
        },
      });
    },
    [navigate]
  );

  if (isLoading) {
    return <LoadingSkeleton pageSize={pageSize} />;
  }

  if (!data?.length) {
    return <NoData />;
  }

  return (
    <PurchasesWrapper>
      <PurchaseTableWrapper>
        {data.map((item, index) => {
          return (
            <PurchasesRow
              key={item.id || index}
              onClick={() => handleRowClick(item)}
            >
              <PurchasesCell span={2} title="Ariza raqami">
                {item.docNum}
              </PurchasesCell>
              <PurchasesCell span={4} title="Yetkazib beruvchi">
                {item.cardName}
              </PurchasesCell>
              <PurchasesCell span={6} title="Kategoriyalar">
                <Row direction="row" gutter={2} align="center">
                  {renderCategories(item?.groups)}
                </Row>
              </PurchasesCell>
              <PurchasesCell span={3} title="Mahsulot soni">
                {item.count ? item?.count + ' dona' : '-'}
              </PurchasesCell>
              <PurchasesCell span={3} title="Yaratilgan sana">
                {item?.docDate ? formatDate(item.docDate) : '-'}
              </PurchasesCell>
              <PurchasesCell textColor="info" span={3} title="Umumiy narx">
                {formatterCurrency(item?.docTotal, item?.docCur)}
              </PurchasesCell>
              <PurchasesCell span={3} title="Status">
                <StatusBadge status={item?.status}>{item?.status}</StatusBadge>
              </PurchasesCell>
            </PurchasesRow>
          );
        })}
      </PurchaseTableWrapper>
    </PurchasesWrapper>
  );
}
