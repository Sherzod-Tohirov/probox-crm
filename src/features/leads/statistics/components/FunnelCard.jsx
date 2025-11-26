import { useMemo } from 'react';
import { Card, Typography } from '@components/ui';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import styles from '../styles/components.module.scss';

export default function FunnelCard({ data = [] }) {
  // Sort like SourcesCard for consistent ordering (desc by count)
  const sortedData = useMemo(() => {
    return Array.isArray(data)
      ? [...data].sort((a, b) => b.count - a.count)
      : [];
  }, [data]);

  // Use the same palette as SourcesCard for visual consistency
  const colors = useMemo(() => {
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
    return sortedData.map((_, index) => COLORS[index % COLORS.length]);
  }, [sortedData]);

  // Build pie data (value + cr for labels)
  const pieData = useMemo(
    () =>
      sortedData.map((d) => ({
        name: d?.name ?? '',
        value: Number(d?.count ?? 0),
        cr: Number(d?.cr ?? 0),
      })),
    [sortedData]
  );

  if (!data || data.length === 0) {
    return (
      <Card title="Konversiya voronkasi">
        <div className={styles.empty}>Ma'lumot topilmadi</div>
      </Card>
    );
  }

  return (
    <Card title="Konversiya voronkasi" style={{ height: '100%' }}>
      <div className={styles.sourcesContainer}>
        {/* Summary List (same layout as SourcesCard) */}
        <div className={styles.sourcesList}>
          <div className={styles.sourcesTable}>
            <div className={styles.tableHeader}>
              <Typography variant="h5">Status</Typography>
              <Typography variant="body1">Soni</Typography>
              <Typography variant="body1">CR</Typography>
            </div>
            {sortedData.map((item, index) => (
              <div key={item.no ?? item.name} className={styles.tableRow}>
                <div className={styles.colSource}>
                  <span
                    className={styles.colorDot}
                    style={{ backgroundColor: colors[index] }}
                  />
                  <Typography variant="body1">{item.name}</Typography>
                  {index === 0 && (
                    <Typography variant="body2" className={styles.topBadge}>
                      Jami
                    </Typography>
                  )}
                </div>
                <div className={styles.colCount}>
                  <Typography variant="h5">
                    {Number(item.count).toLocaleString()}
                  </Typography>
                </div>
                <div className={styles.colPercent}>
                  <Typography variant="body1" className={styles.percentPill}>
                    {Number(item.cr ?? 0).toFixed(2)}%
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart wrapper on the right (reuse pieChartWrapper layout) */}
        <div className={styles.pieChartWrapper}>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${Number(entry?.cr ?? 0).toFixed(2)}%`}
                outerRadius="70%"
                innerRadius="0%"
                style={{ fontSize: '14px', fontWeight: 600 }}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => Number(value ?? 0).toLocaleString()}
                contentStyle={{ fontSize: '14px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
