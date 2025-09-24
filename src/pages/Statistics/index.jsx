import _ from 'lodash';
import { useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button, Col, Row, Table } from '@components/ui';

import Filter from '@features/statistics/components/Filter';
import StatisticChart from '@features/statistics/components/StatisticChart';
import useStatisticsData from '@features/statistics/hooks/useStatisticsData';
import useStatisticsTableColumns from '@features/statistics/hooks/useStatisticsTableColumns';

import useAuth from '@hooks/useAuth';

import formatDate from '@utils/formatDate';

import styles from './style.module.scss';
import Footer from '@/components/Footer';
import { exportTableToExcel } from '@/utils/excel';
import formatterCurrency from '@utils/formatterCurrency';
import { formatToReadablePhoneNumber } from '@utils/formatPhoneNumber';

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
  const [isExporting, setIsExporting] = useState(false);
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

  const clientExportColumns = useMemo(
    () => [
      { key: 'CardCode', header: 'Kod', width: 16 },
      { key: 'CardName', header: 'FIO', width: 28 },
      {
        key: 'Phone1',
        header: 'Telefon',
        formatter: (value) => formatToReadablePhoneNumber(value) || '-',
        width: 18,
      },
      { key: 'Dscription', header: 'Mahsulot', width: 30 },
      {
        key: 'InsTotal',
        header: "To'lov (USD)",
        formatter: (value) => formatterCurrency(value || 0, 'USD'),
        includeTotal: true,
        alignment: { horizontal: 'right' },
        width: 18,
      },
      {
        key: 'PaidToDate',
        header: "To'landi (USD)",
        formatter: (value) => formatterCurrency(value || 0, 'USD'),
        includeTotal: true,
        alignment: { horizontal: 'right' },
        width: 18,
      },
      {
        key: 'SumApplied',
        header: "Qoplandi (USD)",
        formatter: (value) => formatterCurrency(value || 0, 'USD'),
        includeTotal: true,
        alignment: { horizontal: 'right' },
        width: 18,
      },
      {
        key: 'DueDate',
        header: 'Muddati',
        formatter: (value) =>
          value ? formatDate(value, 'YYYY.MM.DD', 'DD.MM.YYYY') : '-',
        width: 16,
      },
      {
        key: 'NewDueDate',
        header: 'Kelishilgan sana',
        formatter: (value) =>
          value ? formatDate(value, 'YYYY.MM.DD', 'DD.MM.YYYY') : '-',
        width: 18,
      },
      {
        key: 'SlpName',
        header: 'Ijrochi',
        width: 20,
        defaultValue: '-',
      },
      {
        key: 'statusLabel',
        header: 'Holati',
        valueGetter: (item) => item?.StatusName || item?.status || '-',
        width: 20,
      },
      {
        key: 'imagesCount',
        header: 'Rasm soni',
        valueGetter: (item) => item?.Images?.length || 0,
        alignment: { horizontal: 'center' },
      },
      {
        key: 'imagesList',
        header: 'Rasmlar',
        valueGetter: (item) =>
          item?.Images?.map((img) => img?.image || img?.url || '')
            .filter(Boolean)
            .join(', '),
        width: 50,
      },
      {
        key: 'Address',
        header: 'Manzil',
        valueGetter: (item) =>
          item?.Address || item?.address || item?.FullAddress || '-',
        width: 36,
      },
    ],
    []
  );

  const handleDownloadExcel = useCallback(async () => {
    try {
      setIsExporting(true);
      const { data: refreshedData } = await clients?.refetch?.();
      const dataset = refreshedData?.data ?? [];
      if (!dataset.length) {
        return;
      }
      const workbookName = `clients-${formatDate(
        params.startDate,
        'YYYY.MM.DD',
        'DD-MM-YYYY'
      )}-${formatDate(params.endDate, 'YYYY.MM.DD', 'DD-MM-YYYY')}.xlsx`;

      await exportTableToExcel({
        mainData: dataset,
        columns: clientExportColumns,
        includeRowIndex: true,
        totals: {
          include: true,
          label: 'Jami',
          sumKeys: ['InsTotal', 'PaidToDate', 'SumApplied'],
        },
        workbookName,
        sheetName: 'Clients',
        metadata: {
          creator: user?.fullName || user?.username || 'Probox CRM',
          properties: {
            title: 'Klientlar hisobot',
            subject: 'Eksport qilingan mijozlar maʼlumotlari',
          },
        },
      });
    } catch (error) {
      console.error('Excel export failed', error);
    } finally {
      setIsExporting(false);
    }
  }, [clientExportColumns, clients, params.endDate, params.startDate, user?.fullName, user?.username]);
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
      <Footer>
        <Row direction={'row'} justify={'end'}>
          <Col>
            <Button
              onClick={handleDownloadExcel}
              variant="filled"
              icon="download"
              iconColor="secondary"
              isLoading={isExporting || clients?.isFetching}
            >
              Excelni yuklash
            </Button>
          </Col>
        </Row>
      </Footer>
    </>
  );
}
