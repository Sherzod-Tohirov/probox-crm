import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Row,
  Col,
  Card,
  Input,
  Button,
  Typography,
  Navigation,
} from '@components/ui';
import useFetchLeadAnalytics from '@hooks/data/statistics/useFetchLeadAnalytics';
import FunnelCard from '@features/leads/statistics/components/FunnelCard';
import SourcesCard from '@features/leads/statistics/components/SourcesCard';
import BranchesCard from '@features/leads/statistics/components/BranchesCard';
import moment from 'moment';
import { setLeadsStatisticsFilter } from '@store/slices/leadsPageSlice';
import styles from './styles/leadsStatistics.module.scss';
import { useForm } from 'react-hook-form';

export default function LeadsStatistics() {
  const dispatch = useDispatch();

  const statisticsFilter = useSelector(
    (state) => state.page.leads.statisticsFilter || {}
  );

  // Date state - default to last 7 days (or persisted statistics filter if available)
  const initialStartDate =
    statisticsFilter?.startDate ||
    moment().subtract(6, 'days').format('DD.MM.YYYY');
  const initialEndDate =
    statisticsFilter?.endDate || moment().format('DD.MM.YYYY');
  const { control, watch } = useForm({
    defaultValues: {
      startDate: initialStartDate,
      endDate: initialEndDate,
    },
  });
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const [filterParams, setFilterParams] = useState({
    start: initialStartDate,
    end: initialEndDate,
  });

  // Fetch analytics data
  const { data, isLoading, isError, refetch } =
    useFetchLeadAnalytics(filterParams);

  const handleFilter = () => {
    const nextFilter = {
      ...statisticsFilter,
      startDate,
      endDate,
    };

    dispatch(setLeadsStatisticsFilter(nextFilter));

    // Update filterParams - React Query will auto-refetch due to queryKey change
    const newParams = {
      start: startDate,
      end: endDate,
    };
    setFilterParams(newParams);
  };

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    if (!data) return null;

    const totalLeads = data.analytics1_funnel?.[0]?.count || 0;
    const totalSources = data.analytics2_sources?.length || 0;
    const totalBranches = data.analytics3_branches?.length || 0;

    return { totalLeads, totalSources, totalBranches };
  }, [data]);

  if (isError) {
    return (
      <div className={styles.pageContainer}>
        <Card>
          <div className={styles.errorContainer}>
            <Typography
              variant="h5"
              style={{ color: '#EF4444', marginBottom: '1.6rem' }}
            >
              Xatolik yuz berdi
            </Typography>
            <Typography style={{ marginBottom: '2.4rem' }}>
              Ma'lumotlarni yuklashda xatolik yuz berdi. Iltimos, qaytadan
              urinib ko'ring.
            </Typography>
            <Button onClick={() => refetch()}>Qayta yuklash</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Row gutter={6}>
        <Col>
          <Navigation />
        </Col>
        <Col flexGrow fullWidth>
          <Card className={styles.filterCard}>
            <Row gutter={6} className={styles.filterToolbar}>
              <Col flexGrow>
                <Row direction="row" gutter={4}>
                  {' '}
                  <Col xs={12} md={5}>
                    <Input
                      name="startDate"
                      type="date"
                      size="longer"
                      variant="outlined"
                      label="Boshlanish sanasi"
                      datePickerOptions={{
                        maxDate: endDate,
                      }}
                      control={control}
                      disabled={isLoading}
                    />
                  </Col>
                  <Col xs={12} md={5}>
                    <Input
                      name="endDate"
                      type="date"
                      size="longer"
                      variant="outlined"
                      label="Tugash sanasi"
                      datePickerOptions={{
                        minDate: startDate,
                      }}
                      control={control}
                      disabled={isLoading}
                    />
                  </Col>
                  <Col xs={12} md={4} style={{ marginTop: 'auto' }}>
                    <Button
                      fullWidth
                      onClick={handleFilter}
                      disabled={isLoading}
                      isLoading={isLoading}
                    >
                      Filtrlash
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col fullWidth>
                <Typography variant="body2">
                  Tanlangan davr: {filterParams.start} – {filterParams.end}
                </Typography>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col fullWidth>
          {!isLoading && data && (
            <div className={styles.analyticsGrid}>
              {/* Summary Cards */}
              {summaryMetrics && (
                <div className={styles.summaryGrid}>
                  <Card className={styles.summaryCardCompact}>
                    <div className={styles.summaryContent}>
                      <Typography
                        variant="body1"
                        className={styles.summaryLabel}
                      >
                        Jami leadlar
                      </Typography>
                      <Typography variant="h3" className={styles.summaryValue}>
                        {summaryMetrics.totalLeads.toLocaleString()}
                      </Typography>
                    </div>
                  </Card>
                  <Card className={styles.summaryCardCompact}>
                    <div className={styles.summaryContent}>
                      <Typography
                        variant="body1"
                        className={styles.summaryLabel}
                      >
                        Manbalar soni
                      </Typography>
                      <Typography variant="h3" className={styles.summaryValue}>
                        {summaryMetrics.totalSources}
                      </Typography>
                    </div>
                  </Card>
                  <Card className={styles.summaryCardCompact}>
                    <div className={styles.summaryContent}>
                      <Typography
                        variant="body1"
                        className={styles.summaryLabel}
                      >
                        Filiallar soni
                      </Typography>
                      <Typography variant="h3" className={styles.summaryValue}>
                        {summaryMetrics.totalBranches}
                      </Typography>
                    </div>
                  </Card>
                </div>
              )}

              {/* Analytics Cards Grid */}
              <div className={styles.chartsGrid}>
                <div className={styles.chartItem}>
                  <FunnelCard data={data.analytics1_funnel} />
                </div>
                <div className={styles.chartItem}>
                  <SourcesCard data={data.analytics2_sources} />
                </div>
                <div className={styles.chartItem}>
                  <BranchesCard data={data.analytics3_branches} />
                </div>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}
