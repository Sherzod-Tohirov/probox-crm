import { useMemo } from 'react';
import { Card, Typography } from '@components/ui';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import styles from '../styles/components.module.scss';

export default function FunnelCard({ data = [] }) {
  const colors = useMemo(() => {
    const themeColors = [
      '#0a4d68', // Primary - dark teal (start of funnel)
      '#1e6b8a', // Medium teal
      '#2d89ac', // Teal-blue
      '#3b9ec9', // Sky blue
      '#10b981', // Emerald green (success)
      '#06b6d4', // Bright cyan
      '#3b82f6', // Blue
      '#8b5cf6', // Purple
    ];
    return data.map((_, index) => themeColors[index % themeColors.length]);
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <Card title="Konversiya voronkasi">
        <div className={styles.empty}>Ma'lumot topilmadi</div>
      </Card>
    );
  }

  const maxCount = data[0]?.count || 1;

  return (
    <Card title="Konversiya voronkasi" style={{ height: '100%' }}>
      <div className={styles.funnelContainer}>
        {/* Desktop Bar Chart */}
        <div className={styles.funnelChart}>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 20, left: -40, bottom: 10 }}
            >
              <XAxis type="number" tick={{ fontSize: 16 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={180}
                tick={{ fontSize: 15 }}
              />
              <Tooltip
                formatter={(value, name, props) => [
                  `${value} (${props.payload.cr}%)`,
                  props.payload.name,
                ]}
                contentStyle={{ fontSize: '16px' }}
              />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mobile List View */}
        <div className={styles.funnelList}>
          {data.map((step, index) => (
            <div key={step.no} className={styles.funnelStep}>
              <div className={styles.stepInfo}>
                <div className={styles.stepNumber}>{step.no}</div>
                <div className={styles.stepDetails}>
                  <Typography variant="body1" className={styles.stepName}>
                    {step.name}
                  </Typography>
                  <div className={styles.stepMetrics}>
                    <Typography variant="h5" className={styles.count}>
                      {step.count.toLocaleString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      className={styles.cr}
                      style={{ backgroundColor: colors[index] }}
                    >
                      CR: {step.cr}%
                    </Typography>
                  </div>
                </div>
              </div>
              <div className={styles.stepBar}>
                <div
                  className={styles.stepBarFill}
                  style={{
                    width: `${(step.count / maxCount) * 100}%`,
                    backgroundColor: colors[index],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
