import { Badge, Card, Col, Row, Typography } from '@/components/ui';
import styles from './styles.module.scss';
import { PurchasesRow } from './PurchasesRow';
import { PurchasesCell } from './PurchasesCell';
import { formatCurrencyUZS } from '@/features/leads/utils/deviceUtils';
import React, { useCallback, useMemo } from 'react';

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
    <Row align={'center'} justify={'center'}>
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

const statusColorMap = {
  Tasdiqlangan: 'success',
  waiting: 'warning',
  declined: 'danger',
};

const categoryColorMap = {
  Telefonlar: 'info',
  'Maishiy texnika': 'warning',
};

export function PurchasesTable({ data }) {
  if (!data?.length) {
    return <NoData />;
  }
  const renderCategories = useCallback((categories) => {
    if (!categories?.length)
      return (
        <Col>
          <Badge color={'warning'}>{"Ma'lum emas"}</Badge>
        </Col>
      );
    const visibleCategories =
      categories.length <= 2 ? categories : [...categories.slice(0, 2), '...'];

    return visibleCategories.map((category) => {
      return (
        <Col>
          <Badge color={categoryColorMap[category] || 'black'}>
            {category}
          </Badge>
        </Col>
      );
    });
  }, []);

  return (
    <PurchasesWrapper>
      {data.map((item) => {
        return (
          <PurchasesRow>
            <PurchasesCell span={2} title={'Ariza raqami'}>
              {item.contract_no}
            </PurchasesCell>
            <PurchasesCell span={4} title={'Yetkazib beruvchi'}>
              {item.courier}
            </PurchasesCell>
            <PurchasesCell span={6} title={'Kategoriyalar'}>
              <Row direction={'row'} gutter={2} align={'center'}>
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
