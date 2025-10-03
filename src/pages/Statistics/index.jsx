import _ from 'lodash';
import { useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';

import { Button, Col, Row, Table } from '@components/ui';

import Filter from '@features/statistics/components/Filter';
import StatisticChart from '@features/statistics/components/StatisticChart';
import useStatisticsData from '@features/statistics/hooks/useStatisticsData';
import useStatisticsTableColumns from '@features/statistics/hooks/useStatisticsTableColumns';
import useAuth from '@hooks/useAuth';
import formatDate from '@utils/formatDate';
import styles from './style.module.scss';
import Footer from '@/components/Footer';
import StickyFooterPortal from '@/components/Footer/StickyFooterPortal';
import hasRole from '@/utils/hasRole';
import useStatisticsExcelExport from '@features/statistics/hooks/useStatisticsExcelExport';

export default function Statistics() {
  const filterState = useSelector((state) => state.page.statistics.filter);
  const { user } = useAuth();
  const { monthlyStatisticsColumns, salesPersonStatisticsColumns } =
    useStatisticsTableColumns();
  const [params, setParams] = useState(() => ({
    startDate: formatDate(filterState.startDate, 'DD.MM.YYYY', 'YYYY.MM.DD'),
    endDate: formatDate(filterState.endDate, 'DD.MM.YYYY', 'YYYY.MM.DD'),
    slpCode: filterState.slpCode === '' ? user?.slpCode : filterState.slpCode,
  }));
  const [formattedMonthlyData, setFormattedMonthlyData] = useState([]);
  const { monthly, salesPerson, clients, utils } = useStatisticsData(params);

  const handleFilter = useCallback(
    (data) => {
      setParams({
        startDate: formatDate(data.startDate, 'DD.MM.YYYY', 'YYYY.MM.DD'),
        endDate: formatDate(data.endDate, 'DD.MM.YYYY', 'YYYY.MM.DD'),
        slpCode: _.map(data.slpCode, 'value').join(',') || user?.slpCode,
      });
    },
    [user?.slpCode]
  );
  
  useEffect(() => {
    if (monthly?.data?.length) {
      const formattedData = utils.formatMonthlyData(monthly.data);
      setFormattedMonthlyData(formattedData);
    } else {
      setFormattedMonthlyData([]);
    }
  }, [monthly?.data]);

  const {
    handleDownloadExcel: handleDownloadClientExcel,
    isExporting: isExportingClient,
  } = useStatisticsExcelExport({
    clients,
    params,
    user,
  });

  return (
    <>
      <Row gutter={8}>
        <Col fullWidth className={styles['sticky-col']}>
          <Filter onFilter={handleFilter} setParams={setParams} />
        </Col>
        <Col fullWidth>
          <Table
            scrollable
            uniqueKey="SlpCode"
            data={salesPerson.data}
            isLoading={salesPerson.isLoading}
            columns={salesPersonStatisticsColumns}
          />
        </Col>
        <Col fullWidth>
          <StatisticChart
            title={'Oylik statistika'}
            date={{
              startDate: formatDate(
                params.startDate,
                'YYYY.MM.DD',
                'DD.MM.YYYY'
              ),
              endDate: formatDate(params.endDate, 'YYYY.MM.DD', 'DD.MM.YYYY'),
            }}
            data={formattedMonthlyData}
            isLoading={monthly.isLoading}
            keys={{
              name: 'day',
              firstLine: 'jami',
              secondLine: 'qoplandi',
            }}
          />
        </Col>
        <Col fullWidth>
          <Table
            scrollable
            uniqueKey="DueDate"
            data={monthly.data}
            isLoading={monthly.isLoading}
            columns={monthlyStatisticsColumns}
          />
        </Col>
      </Row>
      {hasRole(user, ['Manager', 'CEO']) && (
        <StickyFooterPortal>
          <Footer className={styles['footer-container']}>
            <Row direction={'row'} justify={'end'}>
              <Col>
                <Button
                  onClick={handleDownloadClientExcel}
                  variant="filled"
                  icon="download"
                  iconColor="secondary"
                  isLoading={isExportingClient || clients?.isFetching}
                >
                  Excelni yuklash
                </Button>
              </Col>
            </Row>
          </Footer>
        </StickyFooterPortal>
      )}
    </>
  );
}
