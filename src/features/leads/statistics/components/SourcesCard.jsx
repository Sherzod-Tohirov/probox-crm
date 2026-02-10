import { useMemo, useState } from 'react';
import { Card, Row, Col, Typography } from '@components/ui';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from 'recharts';
import styles from '../styles/components.module.scss';

const COLORS = [
  '#0a4d68', // Primary - dark teal
  '#3b82f6', // Blue - bright blue
  '#10b981', // Green - emerald
  '#f59e0b', // Orange - amber
  '#ef4444', // Red - rose
  '#8b5cf6', // Purple - violet
  '#06b6d4', // Cyan
  '#ec4899', // Pink
];

export default function SourcesCard({ data = [] }) {
  const [showTrends, setShowTrends] = useState(false);

  if (!data || data.length === 0) {
    return (
      <Card title="Manbalar bo'yicha leadlar">
        <div className={styles.empty}>Ma'lumot topilmadi</div>
      </Card>
    );
  }

  const sortedData = [...data].sort((a, b) => b.count - a.count);
  const pieData = sortedData.map((item, index) => ({
    name: item.source,
    value: item.count,
    percent: item.percent,
    color: COLORS[index % COLORS.length],
  }));

  // Combine all per_day data into unified chart data
  const unifiedChartData = useMemo(() => {
    // Collect all unique days
    const daysSet = new Set();
    sortedData.forEach((item) => {
      item.per_day?.forEach((day) => daysSet.add(day.day));
    });

    const sortedDays = Array.from(daysSet).sort();

    // Build chart data with all sources
    return sortedDays.map((day) => {
      const dataPoint = { day };
      sortedData.forEach((item, index) => {
        const dayData = item.per_day?.find((d) => d.day === day);
        dataPoint[item.source] = dayData?.count || 0;
      });
      return dataPoint;
    });
  }, [sortedData]);

  return (
    <Card title="Manbalar bo'yicha leadlar" style={{ height: '100%' }}>
      <div className={styles.sourcesContainer}>
        {/* Summary List */}
        <div className={styles.sourcesList}>
          <div className={styles.sourcesTable}>
            <div className={styles.tableHeader}>
              <Typography variant="h5">Manba</Typography>
              <Typography variant="body1">Soni</Typography>
              <Typography variant="body1">Foiz</Typography>
            </div>
            {sortedData.map((item, index) => (
              <div key={item.source} className={styles.tableRow}>
                <div className={styles.colSource}>
                  <span
                    className={styles.colorDot}
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <Typography variant="body1">{item.source}</Typography>
                  {index === 0 && (
                    <Typography variant="body2" className={styles.topBadge}>
                      #1 manba
                    </Typography>
                  )}
                </div>
                <div className={styles.colCount}>
                  <Typography variant="h5">
                    {item.count.toLocaleString()}
                  </Typography>
                </div>
                <div className={styles.colPercent}>
                  <Typography variant="body1" className={styles.percentPill}>
                    {item.percent.toFixed(2)}%
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart */}
        <div className={styles.pieChartWrapper}>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.percent.toFixed(1)}%`}
                outerRadius="70%"
                innerRadius="0%"
                style={{ fontSize: '14px', fontWeight: 600 }}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => value.toLocaleString()}
                contentStyle={{
                  fontSize: '14px',
                  backgroundColor: 'var(--primary-bg)',
                  border: '1px solid var(--primary-border-color)',
                  color: 'var(--chart-text-color)',
                }}
                labelStyle={{ color: 'var(--chart-text-color)' }}
                itemStyle={{ color: 'var(--chart-text-color)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Unified Trend Chart - Accordion */}
        <div className={styles.sourceTrends}>
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
                        const [year, month, day] = value.split('.');
                        return `${day}.${month}`;
                      }}
                      tick={{ fontSize: 13, fill: 'var(--chart-axis-label-color)' }}
                      axisLine={{ stroke: 'var(--chart-grid-color)' }}
                      tickLine={{ stroke: 'var(--chart-grid-color)' }}
                    />
                    <YAxis
                      tick={{ fontSize: 13, fill: 'var(--chart-axis-label-color)' }}
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
                        key={item.source}
                        type="monotone"
                        dataKey={item.source}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                        name={item.source}
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
