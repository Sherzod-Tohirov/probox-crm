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
                outerRadius={100}
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
                contentStyle={{ fontSize: '14px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Trend Lines for Each Source - Accordion */}
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

          {showTrends && (
            <Row gutter={4} className={styles.trendsContent}>
              {sortedData.map((item, index) => (
                <Col fullWidth key={item.source} className={styles.trendItem}>
                  <Row>
                    <Col>
                      {' '}
                      <div className={styles.trendHeader}>
                        <span
                          className={styles.colorDot}
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <Typography variant="body2">{item.source}</Typography>
                      </div>
                    </Col>
                    <Col fullWidth>
                      <div className={styles.trendChart}>
                        <ResponsiveContainer width="100%" height={70}>
                          <LineChart data={item.per_day}>
                            <XAxis dataKey="day" hide />
                            <YAxis hide />
                            <Tooltip
                              formatter={(value, name, props) => [
                                `${value} ta lead`,
                                props.payload.day,
                              ]}
                              contentStyle={{ fontSize: '14px' }}
                            />
                            <Line
                              type="monotone"
                              dataKey="count"
                              stroke={COLORS[index % COLORS.length]}
                              strokeWidth={2.5}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </Col>
                  </Row>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </Card>
  );
}
