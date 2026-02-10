import { Card, Col, Row, Spinner } from '@/components/ui';
import useFetchExecutors from '@/hooks/data/useFetchExecutors';
import { useMemo } from 'react';
import EChart from '@/components/shared/EChart';

const SERIES_CONFIG = [
  { key: 'called', name: "Qo'ng'iroqlar", color: '#1f8ed8' },
  { key: 'interested', name: 'Qiziqish bildirdi', color: '#4ad66d' },
  { key: 'passport', name: 'Pasport', color: '#8b5cf6' },
  { key: 'meetingSet', name: 'Uchrashuv', color: '#f4b267' },
  { key: 'visit', name: "Uchrashuv bo'ldi", color: '#f97316' },
  { key: 'purchase', name: "Xarid bo'ldi", color: '#16a34a' },
];

const toNumber = (value) => Number(value || 0);

export default function StaffPerformanceChartSection({
  data = {},
  isLoading = false,
}) {
  const title = "Aloqa markazlari ko'rsatkichlari";
  const { data: executors = [], isLoading: isExecutorsLoading } =
    useFetchExecutors();

  const operatorRows = useMemo(() => {
    const list = Array.isArray(data?.analytics1_funnel_by_operators)
      ? data.analytics1_funnel_by_operators
      : [];
    const executorMap = new Map(
      executors.map((executor) => [
        String(
          executor?.SlpCode ?? executor?.slpCode ?? executor?.Slp_Code ?? ''
        ),
        executor?.SlpName ?? executor?.slpName ?? '',
      ])
    );

    return [...list]
      .map((item) => {
        const code = String(item?.operator ?? '');
        const mappedName = executorMap.get(code);
        return {
          ...item,
          code,
          displayName: mappedName || `Operator ${code}`,
        };
      })
      .sort((a, b) => toNumber(b?.totals?.leads) - toNumber(a?.totals?.leads));
  }, [data, executors]);

  const totalLeads = operatorRows.reduce(
    (sum, item) => sum + toNumber(item?.totals?.leads),
    0
  );

  const enhancedSeries = SERIES_CONFIG.map((config) => ({
    ...config,
    data: operatorRows.map((item) => toNumber(item?.totals?.[config.key])),
  }));
  const chartWidth = Math.max(1100, operatorRows.length * 120);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'var(--primary-bg)',
      borderColor: 'var(--primary-border-color)',
      textStyle: { color: 'var(--chart-text-color)', fontSize: 13 },
    },
    legend: {
      data: enhancedSeries.map((s) => s.name),
      bottom: 0,
      textStyle: { color: 'var(--chart-legend-color)', fontSize: 13 },
    },
    grid: {
      left: '3%',
      right: '3%',
      top: '8%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: operatorRows.map((item) => item.displayName),
      axisLine: { lineStyle: { color: 'var(--primary-border-color)' } },
      axisLabel: {
        color: 'var(--chart-axis-label-color)',
        fontSize: 12,
        interval: 0,
        rotate: operatorRows.length > 10 ? 22 : 0,
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: { color: 'var(--primary-border-color)', type: 'dashed' },
      },
      axisLabel: { color: 'var(--chart-axis-label-color)', fontSize: 12 },
    },
    series: enhancedSeries.map((s) => ({
      name: s.name,
      type: 'bar',
      data: s.data,
      itemStyle: {
        color: s.color,
        borderRadius: [4, 4, 0, 0],
      },
      barMaxWidth: 14,
      barGap: '20%',
    })),
  };

  return (
    <Card
      title={title}
      rightTitle={
        <span className='text-[16px]' style={{ color: 'var(--secondary-color)' }}>
          Jami leadlar{' '}
          <span
            style={{
              marginLeft: 8,
              background: 'var(--success-chip-bg)',
              color: 'var(--success-chip-color)',
              padding: '6px 10px',
              borderRadius: 10,
              fontWeight: 700,
            }}
          >
            {totalLeads.toLocaleString()}
          </span>
        </span>
      }
    >
      <Row>
        <Col fullWidth>
          {isLoading || isExecutorsLoading ? (
            <div className="h-[350px] flex items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <EChart option={option} height={350} style={{ width: `${chartWidth}px` }} />
            </div>
          )}
        </Col>
      </Row>
    </Card>
  );
}
