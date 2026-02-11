import { useState, useMemo, useEffect } from 'react';
import { Card, Typography } from '@components/ui';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from '../styles/components.module.scss';

const COLORS = [
  '#0a4d68', // Primary - dark teal
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Orange
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#ec4899', // Pink
];

export default function BranchesCard({ data = [] }) {
  const [showTrends, setShowTrends] = useState(false);
  const [axisLabelColor, setAxisLabelColor] = useState('#000000');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateAxisLabelColor = () => {
      const root = document.documentElement;
      const theme = root.getAttribute('data-theme');
      setAxisLabelColor(theme === 'dark' ? '#ffffff' : '#000000');
    };

    const root = document.documentElement;
    const observer = new MutationObserver((mutations) => {
      if (
        mutations.some(
          (mutation) =>
            mutation.type === 'attributes' &&
            (mutation.attributeName === 'data-theme' ||
              mutation.attributeName === 'class')
        )
      ) {
        updateAxisLabelColor();
      }
    });

    updateAxisLabelColor();
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });

    return () => observer.disconnect();
  }, []);

  const sortedData = useMemo(
    () => [...(data || [])].sort((a, b) => b.count - a.count),
    [data]
  );

  // Combine all per_day data into unified chart data
  const unifiedChartData = useMemo(() => {
    // Collect all unique days
    const daysSet = new Set();
    sortedData.forEach((item) => {
      item.per_day?.forEach((day) => daysSet.add(day.day));
    });

    const sortedDays = Array.from(daysSet).sort();

    // Build chart data with all branches
    return sortedDays.map((day) => {
      const dataPoint = { day };
      sortedData.forEach((item) => {
        const dayData = item.per_day?.find((d) => d.day === day);
        dataPoint[item.branch_name] = dayData?.count || 0;
      });
      return dataPoint;
    });
  }, [sortedData]);

  if (!sortedData.length) {
    return (
      <Card title="Filiallar bo'yicha statistika">
        <div className={styles.empty}>Ma'lumot topilmadi</div>
      </Card>
    );
  }

  const getPercentColor = (percent) => {
    if (percent === 0) return '#9CA3AF';
    if (percent < 10) return '#F59E0B';
    if (percent < 30) return '#3B82F6';
    return '#10B981';
  };

  return (
    <Card title="Filiallar bo'yicha statistika" style={{ height: '100%' }}>
      <div className={styles.branchesContainer}>
        {/* Desktop Table */}
        <div className={styles.branchesTable}>
          <div className={styles.tableHeader}>
            <Typography variant="body1" className={styles.colBranch}>
              Filial nomi
            </Typography>
            <Typography variant="body1" className={styles.colCount}>
              Leadlar soni
            </Typography>
            <Typography variant="body1" className={styles.colPercent}>
              Foiz
            </Typography>
          </div>
          {sortedData.map((branch) => (
            <div key={branch.branch_id} className={styles.branchRow}>
              <div className={styles.branchMainRow}>
                <Typography variant="body1">{branch.branch_name}</Typography>
                <Typography variant="h5">
                  {branch.count.toLocaleString()}
                </Typography>
                <Typography variant="body1">
                  {branch.percent.toFixed(2)}%
                </Typography>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Cards */}
        <div className={styles.branchesMobile}>
          {sortedData.map((branch) => (
            <div key={branch.branch_id} className={styles.branchCard}>
              <div className={styles.branchCardHeader}>
                <div className={styles.branchCardTitle}>
                  {branch.branch_name}
                </div>
                <div className={styles.branchCardMeta}>
                  <span className={styles.count}>
                    {branch.count.toLocaleString()} ta
                  </span>
                  <span
                    className={styles.percentBadge}
                    style={{
                      backgroundColor: getPercentColor(branch.percent),
                    }}
                  >
                    {branch.percent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Unified Trend Chart - Accordion */}
        <div className={styles.sourceTrends} style={{ marginTop: 'auto' }}>
          <div
            className={styles.trendsHeader}
            onClick={() => setShowTrends(!showTrends)}
          >
            <Typography variant="h5">Kunlik dinamika</Typography>
            <div className={styles.trendsToggle}>
              {showTrends ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>

          {showTrends && unifiedChartData.length > 0 && (
            <div className={styles.trendsContent}>
              <div className={styles.unifiedChart}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={unifiedChartData}>
                    <XAxis
                      dataKey="day"
                      tickFormatter={(value) => {
                        const [, month, day] = value.split('.');
                        return `${day}.${month}`;
                      }}
                      tick={{ fontSize: 13, fill: axisLabelColor }}
                      axisLine={{ stroke: 'var(--chart-grid-color)' }}
                      tickLine={{ stroke: 'var(--chart-grid-color)' }}
                    />
                    <YAxis
                      tick={{ fontSize: 13, fill: axisLabelColor }}
                      axisLine={{ stroke: 'var(--chart-grid-color)' }}
                      tickLine={{ stroke: 'var(--chart-grid-color)' }}
                    />
                    <Tooltip
                      contentStyle={{
                        fontSize: '14px',
                        backgroundColor: 'var(--primary-bg)',
                        border: '1px solid var(--primary-border-color)',
                        color: 'var(--chart-text-color)',
                      }}
                      labelStyle={{ color: 'var(--chart-text-color)' }}
                      itemStyle={{ color: 'var(--chart-text-color)' }}
                      formatter={(value, name) => [`${value} ta lead`, name]}
                    />
                    {sortedData.map((item, index) => (
                      <Line
                        key={item.branch_id}
                        type="monotone"
                        dataKey={item.branch_name}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                        name={item.branch_name}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
