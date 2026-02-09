import { useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './gauge.module.scss';
import classNames from 'classnames';
import Card from '../Card';

const GAUGE_COLORS = {
  green: { stroke: '#22c55e', bg: '#dcfce7' },
  orange: { stroke: '#f59e0b', bg: '#fef3c7' },
  red: { stroke: '#ef4444', bg: '#fee2e2' },
  blue: { stroke: '#3b82f6', bg: '#dbeafe' },
};

function formatNumber(num) {
  if (num == null) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function getAutoColor(percentage) {
  if (percentage >= 70) return 'green';
  if (percentage >= 40) return 'orange';
  return 'red';
}

export default function Gauge({
  value = 0,
  total = 100,
  label = '',
  color,
  size = 'md',
  showPercentage = true,
  percentagePosition = 'top-right',
  withCard = false,
  className = '',
}) {
  const percentage = useMemo(() => {
    if (!total || total === 0) return 0;
    return Math.min(Math.round((value / total) * 100), 100);
  }, [value, total]);

  const resolvedColor = color || getAutoColor(percentage);
  const colors = GAUGE_COLORS[resolvedColor] || GAUGE_COLORS.green;

  // SVG arc calculations
  const strokeWidth = 12;
  const viewBoxSize = 120;
  const radius = (viewBoxSize - strokeWidth) / 2;
  const centerX = viewBoxSize / 2;
  const centerY = viewBoxSize / 2 + 8;

  // Semi-circle arc from 180° to 0° (left to right, top half)
  const startAngle = Math.PI;
  const endAngle = 0;
  const arcLength = Math.PI * radius;
  const filledLength = (percentage / 100) * arcLength;
  const dashOffset = arcLength - filledLength;

  const arcStartX = centerX + radius * Math.cos(startAngle);
  const arcStartY = centerY - radius * Math.sin(startAngle);
  const arcEndX = centerX + radius * Math.cos(endAngle);
  const arcEndY = centerY - radius * Math.sin(endAngle);

  const pathD = `M ${arcStartX} ${arcStartY} A ${radius} ${radius} 0 0 1 ${arcEndX} ${arcEndY}`;

  const percentageBadge = showPercentage && (
    <span
      className={classNames(
        styles.gauge__percentage,
        styles[`gauge__percentage--${percentagePosition}`]
      )}
      style={{ backgroundColor: colors.bg, color: colors.stroke }}
    >
      {percentage}%
    </span>
  );

  const content = (
    <div
      className={classNames(styles.gauge, styles[`gauge--${size}`], className)}
    >
      <div className={styles.gauge__svg}>
        <svg
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize / 2 + strokeWidth + 16}`}
        >
          {/* Background arc */}
          <path
            d={pathD}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Filled arc */}
          <path
            d={pathD}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={dashOffset}
            className={styles.gauge__arc}
          />
          {/* Value text inside arc */}
          <text
            x={centerX}
            y={centerY + 2}
            textAnchor="middle"
            dominantBaseline="auto"
            className={styles.gauge__value}
            fill={colors.stroke}
          >
            {formatNumber(value)}
          </text>
          {/* Label text below value */}
          {label && (
            <text
              x={centerX}
              y={centerY + 16}
              textAnchor="middle"
              dominantBaseline="hanging"
              className={styles.gauge__label}
              fill="var(--secondary-color)"
            >
              {label}
            </text>
          )}
        </svg>
        {percentagePosition === 'top-right' && percentageBadge}
      </div>
      {percentagePosition !== 'top-right' && percentageBadge}
    </div>
  );

  if (withCard) {
    return (
      <Card
        className={styles.gauge__card}
        bodyClassName={styles['gauge__card-body']}
      >
        {content}
      </Card>
    );
  }

  return content;
}

Gauge.propTypes = {
  value: PropTypes.number,
  total: PropTypes.number,
  label: PropTypes.string,
  color: PropTypes.oneOf(['green', 'orange', 'red', 'blue']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  showPercentage: PropTypes.bool,
  percentagePosition: PropTypes.oneOf([
    'top-right',
    'bottom-center',
    'top-left',
  ]),
  withCard: PropTypes.bool,
  className: PropTypes.string,
};
