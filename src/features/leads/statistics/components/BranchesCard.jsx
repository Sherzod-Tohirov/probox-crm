import { useState } from 'react';
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

export default function BranchesCard({ data = [] }) {
  const [expandedBranch, setExpandedBranch] = useState(null);

  if (!data || data.length === 0) {
    return (
      <Card title="Filiallar bo'yicha statistika">
        <div className={styles.empty}>Ma'lumot topilmadi</div>
      </Card>
    );
  }

  const sortedData = [...data].sort((a, b) => b.count - a.count);

  const toggleBranch = (branchId) => {
    setExpandedBranch(expandedBranch === branchId ? null : branchId);
  };

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
            <Typography variant="body1">Batafsil</Typography>
          </div>
          {sortedData.map((branch) => {
            const isExpanded = expandedBranch === branch.branch_id;
            const hasData = branch.per_day?.some((day) => day.count > 0);

            return (
              <div key={branch.branch_id} className={styles.branchRow}>
                <div
                  className={`${styles.branchMainRow} ${isExpanded ? styles.expanded : ''}`}
                  onClick={() => toggleBranch(branch.branch_id)}
                >
                  <Typography variant="body1">{branch.branch_name}</Typography>
                  <Typography variant="h5">
                    {branch.count.toLocaleString()}
                  </Typography>
                  <Typography variant="body1">
                    {branch.percent.toFixed(2)}%
                  </Typography>
                  <div className={styles.colAction}>
                    {isExpanded ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className={styles.branchExpanded}>
                    {hasData ? (
                      <div className={styles.branchChart}>
                        <Typography variant="h6">Kunlik dinamika</Typography>
                        <ResponsiveContainer width="100%" height={260}>
                          <LineChart data={branch.per_day}>
                            <XAxis
                              dataKey="day"
                              tickFormatter={(value) => {
                                const [year, month, day] = value.split('.');
                                return `${day}.${month}`;
                              }}
                              tick={{ fontSize: 13 }}
                            />
                            <YAxis tick={{ fontSize: 13 }} />
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
                              stroke="#0a4d68"
                              strokeWidth={2.5}
                              dot={{ fill: '#0a4d68', r: 5 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className={styles.noActivity}>
                        Hozircha faoliyat yo'q
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Cards */}
        <div className={styles.branchesMobile}>
          {sortedData.map((branch) => {
            const isExpanded = expandedBranch === branch.branch_id;
            const hasData = branch.per_day?.some((day) => day.count > 0);

            return (
              <div key={branch.branch_id} className={styles.branchCard}>
                <div
                  className={styles.branchCardHeader}
                  onClick={() => toggleBranch(branch.branch_id)}
                >
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
                    {isExpanded ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className={styles.branchCardBody}>
                    {hasData ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={branch.per_day}>
                          <XAxis
                            dataKey="day"
                            tickFormatter={(value) => {
                              const [year, month, day] = value.split('.');
                              return `${day}.${month}`;
                            }}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis hide />
                          <Tooltip
                            formatter={(value, name, props) => [
                              `${value} ta lead`,
                              props.payload.day,
                            ]}
                            contentStyle={{ fontSize: '13px' }}
                          />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#0a4d68"
                            strokeWidth={2.5}
                            dot={{ fill: '#0a4d68', r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className={styles.noActivity}>
                        Hozircha faoliyat yo'q
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
