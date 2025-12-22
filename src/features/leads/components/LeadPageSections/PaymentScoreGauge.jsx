import styles from '@/pages/Leads/styles/style.module.scss';
import { formatCurrencyUZS } from '@/features/leads/utils/deviceUtils';

export default function PaymentScoreGauge({
  paymentScore,
  totalSum = 0,
  closedSum = 0,
  overdueDebt = 0,
  totalContracts = 0,
  openContracts = 0,
  longestDelay = 0,
  averagePaymentDay = 0,
}) {
  // Get payment score style and label
  const getPaymentScoreInfo = (score) => {
    // Convert to number if it's a string
    const numScore = score != null ? Number(score) : null;

    if (numScore == null || isNaN(numScore)) {
      return { className: 'score-default', label: '-', score: '-' };
    }

    // 0.0–4.99: Yomon, 5.0–6.99: Qoniqarsiz, 7.0–8.99: Qoniqarli,
    // 9.0–9.99: Yaxshi, 10.0: Zo'r
    const scoreText = numScore.toFixed(2);

    if (numScore >= 0 && numScore < 5) {
      return { className: 'score-bad', label: 'Yomon', score: scoreText };
    } else if (numScore >= 5 && numScore < 7) {
      return { className: 'score-poor', label: 'Qoniqarsiz', score: scoreText };
    } else if (numScore >= 7 && numScore < 9) {
      return { className: 'score-fair', label: 'Qoniqarli', score: scoreText };
    } else if (numScore >= 9 && numScore < 10) {
      return { className: 'score-good', label: 'Yaxshi', score: scoreText };
    } else if (numScore === 10) {
      return { className: 'score-excellent', label: "Zo'r", score: scoreText };
    }
    return { className: 'score-default', label: '-', score: '-' };
  };

  // Calculate gauge arc point
  const getGaugePoint = (
    value,
    maxValue,
    radius,
    centerX,
    centerY,
    startAngle = 180
  ) => {
    const percentage = value / maxValue;
    // Angle: 0 = 180° (left), 10 = 0° (right)
    const angle = startAngle - percentage * 180;
    const radian = (angle * Math.PI) / 180;
    const x = centerX + radius * Math.cos(radian);
    const y = centerY - radius * Math.sin(radian);
    return { x, y, angle, radian };
  };

  // Gauge configuration constants
  const gaugeMax = 10;
  const centerX = 100;
  const centerY = 100;
  const radius = 80;

  // Calculate segment points with equal gaps between segments
  // 0-4.99: Yomon (qizil), 5-6.99: Qoniqarsiz (to'q sariq),
  // 7-8.99: Qoniqarli (sariq), 9-10: Yaxshi (yashil)
  const gapSize = 0.15; // Equal gap between all segments (same visual distance)
  const point0 = getGaugePoint(0, gaugeMax, radius, centerX, centerY);
  // Red segment: 0 to 4
  const point4End = getGaugePoint(4, gaugeMax, radius, centerX, centerY);
  // Equal gap, then Orange segment: 5 to 6
  const point5Start = getGaugePoint(
    4 + gapSize,
    gaugeMax,
    radius,
    centerX,
    centerY
  );
  const point6End = getGaugePoint(6, gaugeMax, radius, centerX, centerY);
  // Equal gap, then Yellow segment: 7 to 9
  const point7Start = getGaugePoint(
    6 + gapSize,
    gaugeMax,
    radius,
    centerX,
    centerY
  );
  const point9End = getGaugePoint(9, gaugeMax, radius, centerX, centerY);
  // Equal gap, then Green segment starts at 9
  const point9Start = getGaugePoint(9 + gapSize, gaugeMax, radius, centerX, centerY);
  const point10 = getGaugePoint(10, gaugeMax, radius, centerX, centerY);
  // Separate tiny segment for 10 (Zo'r) to make it visible as an arc (not a dot)
  const zorSegmentStartValue = 9.7; // tweak: how long the 10-segment is
  const pointZorStart = getGaugePoint(
    zorSegmentStartValue,
    gaugeMax,
    radius,
    centerX,
    centerY
  );

  // Get pointer color based on value
  const getPointerColor = (value) => {
    if (value == null) return '#9ca3af'; // Grey for null/undefined
    // Convert to number if it's a string
    const numValue = Number(value);
    if (isNaN(numValue)) return '#9ca3af'; // Grey for invalid values
    if (numValue >= 0 && numValue < 5) return '#ef4444'; // Red
    if (numValue >= 5 && numValue < 7) return '#f97316'; // Orange
    if (numValue >= 7 && numValue < 9) return '#eab308'; // Yellow
    if (numValue >= 9 && numValue < 10) return '#22c55e'; // Green
    if (numValue === 10) return '#1CF271'; // Bright Green
    return '#60a5fa'; // Default blue
  };

  // Convert paymentScore to number (it may come as string from server)
  // Check for null, undefined, empty string, or 'null' string
  const isValidScore =
    paymentScore != null &&
    paymentScore !== '' &&
    paymentScore !== 'null' &&
    paymentScore !== 'undefined';
  const gaugeValueRaw = isValidScore ? Number(paymentScore) : null;
  const gaugeValue =
    gaugeValueRaw != null &&
    !isNaN(gaugeValueRaw) &&
    Number.isFinite(gaugeValueRaw)
      ? Math.min(Math.max(gaugeValueRaw, 0), 10)
      : null;
  const pointerPoint =
    gaugeValue != null && !isNaN(gaugeValue)
      ? getGaugePoint(gaugeValue, gaugeMax, radius, centerX, centerY)
      : null;
  const pointerColor = getPointerColor(gaugeValue);
  const scoreInfo = getPaymentScoreInfo(gaugeValue);

  // Format numbers
  const formatNumber = (num) => {
    if (num == null || isNaN(num)) return '0';
    return Number(num).toLocaleString('ru-RU');
  };

  return (
    <div className={styles['payment-dashboard']}>
      {/* Left: Gauge Card */}
      <div className={`${styles['dashboard-card']} ${styles['gauge-card']}`}>
        <div className={styles['card-title']}>To'lov ko'rsatkichi</div>
      <div className={styles['gauge-container']}>
        <svg
          className={styles['gauge-svg']}
          viewBox="0 0 200 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background arc - light grey background visible through gaps */}
          <path
            d={`M ${point0.x} ${point0.y} A ${radius} ${radius} 0 0 1 ${point10.x} ${point10.y}`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Red section (0-4): Yomon */}
          <path
            d={`M ${point0.x} ${point0.y} A ${radius} ${radius} 0 0 1 ${point4End.x} ${point4End.y}`}
            fill="none"
            stroke="#ef4444"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Orange section (5-6): Qoniqarsiz */}
          <path
            d={`M ${point5Start.x} ${point5Start.y} A ${radius} ${radius} 0 0 1 ${point6End.x} ${point6End.y}`}
            fill="none"
            stroke="#f97316"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Yellow section (7-8): Qoniqarli */}
          <path
              d={`M ${point7Start.x} ${point7Start.y} A ${radius} ${radius} 0 0 1 ${point9End.x} ${point9End.y}`}
            fill="none"
            stroke="#eab308"
            strokeWidth="12"
            strokeLinecap="round"
          />
            {/* Green section (9-<10): Yaxshi */}
          <path
              d={`M ${point9Start.x} ${point9Start.y} A ${radius} ${radius} 0 0 1 ${pointZorStart.x} ${pointZorStart.y}`}
            fill="none"
            stroke="#22c55e"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Bright Green section (10): Zo'r */}
          <path
              d={`M ${pointZorStart.x} ${pointZorStart.y} A ${radius} ${radius} 0 0 1 ${point10.x} ${point10.y}`}
            fill="none"
              stroke="#1CF271"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Pointer - circular indicator matching segment color */}
          {pointerPoint && (
            <g transform={`translate(${centerX}, ${centerY})`}>
              <circle
                cx={Math.cos(pointerPoint.radian) * 78}
                cy={-Math.sin(pointerPoint.radian) * 78}
                r="8"
                fill={pointerColor}
                stroke="#ffffff"
                strokeWidth="2.5"
              />
              <circle
                cx={Math.cos(pointerPoint.radian) * 78}
                cy={-Math.sin(pointerPoint.radian) * 78}
                r="3"
                fill="#ffffff"
              />
            </g>
          )}
        </svg>
        <div className={styles['gauge-value']}>
          <span className={styles['gauge-number']}>{scoreInfo.score}</span>
        </div>
        <div className={styles['gauge-scale']}>
          <span>0</span>
          <span
            className={styles['gauge-label']}
            style={{ color: pointerColor }}
          >
            {scoreInfo.label}
          </span>
          <span>10</span>
          </div>
        </div>
      </div>

      {/* Right: Two Rows */}
      <div className={styles['dashboard-right']}>
        {/* Top Row: 3 Cards */}
        <div className={styles['dashboard-row']}>
          {/* Total Sum Card */}
          <div className={`${styles['dashboard-card']} ${styles['top-row-card']}`}>
            <div className={styles['card-icon']}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.9 1.57h1.9c0-.93-.56-2.64-3.8-2.64-2.51 0-3.95 1.3-3.95 3.42 0 1.34.84 2.28 2.65 2.9 1.58.5 2.1.95 2.1 1.78 0 .77-.64 1.31-1.9 1.31-1.42 0-2-.61-2-1.43H6.04c0 1.18 1.9 2.64 5.9 2.64 2.89 0 4.04-1.4 4.04-3.37-.01-1.3-.85-2.2-2.57-2.81z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className={styles['card-value']} style={{ color: '#3b82f6' }}>
              {formatCurrencyUZS(totalSum)}
            </div>
            <div className={styles['card-label']}>Umumiy summa</div>
          </div>

          {/* Closed Sum Card */}
          <div className={`${styles['dashboard-card']} ${styles['top-row-card']}`}>
            <div className={styles['card-icon']}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className={styles['card-value']} style={{ color: '#22c55e' }}>
              {formatCurrencyUZS(closedSum)}
            </div>
            <div className={styles['card-label']}>Yopilgan summa</div>
          </div>

          {/* Overdue Debt Card */}
          <div className={`${styles['dashboard-card']} ${styles['top-row-card']} ${styles['overdue-card-full']}`}>
            <div className={styles['card-icon']}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z"
                  fill="currentColor"
                />
                <circle cx="19" cy="5" r="3" fill="#ef4444" />
              </svg>
            </div>
            <div className={styles['card-value']} style={{ color: '#ef4444' }}>
              {formatCurrencyUZS(overdueDebt)}
            </div>
            <div className={styles['card-label']}>
              Muddati o'tgan qarz. (Rassrochka)
            </div>
          </div>
        </div>

        {/* Bottom Row: 4 Cards */}
        <div className={styles['dashboard-row']}>
          {/* Total Contracts Card */}
          <div className={`${styles['dashboard-card']} ${styles['bottom-row-card']}`}>
            <div className={styles['card-icon']}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className={styles['card-value']}>{formatNumber(totalContracts)}</div>
            <div className={styles['card-label']}>Umumiy shartnomalar soni</div>
          </div>

          {/* Open Contracts Card */}
          <div className={`${styles['dashboard-card']} ${styles['bottom-row-card']}`}>
            <div className={styles['card-icon']}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className={styles['card-value']}>{formatNumber(openContracts)}</div>
            <div className={styles['card-label']}>Ochiq shartnomalar</div>
          </div>

          {/* Longest Delay Card */}
          <div className={`${styles['dashboard-card']} ${styles['bottom-row-card']}`}>
            <div className={styles['card-icon']}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className={styles['card-value']}>
              {longestDelay > 0 ? `${formatNumber(longestDelay)} kun` : '-'}
            </div>
            <div className={styles['card-label']}>Eng cho'zgan kuni</div>
          </div>

          {/* Average Payment Day Card */}
          <div className={`${styles['dashboard-card']} ${styles['bottom-row-card']}`}>
            <div className={styles['card-icon']}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z"
                  fill="currentColor"
                />
                <text
                  x="12"
                  y="16"
                  textAnchor="middle"
                  fontSize="8"
                  fill="currentColor"
                  fontWeight="bold"
                >
                  10
                </text>
              </svg>
            </div>
            <div
              className={styles['card-value']}
              style={{
                color:
                  averagePaymentDay == null || isNaN(averagePaymentDay)
                    ? '#9ca3af'
                    : averagePaymentDay < 0
                    ? '#22c55e'
                    : averagePaymentDay === 0
                    ? '#9ca3af'
                    : '#ef4444',
              }}
            >
              {averagePaymentDay != null &&
              !isNaN(averagePaymentDay) &&
              averagePaymentDay !== null
                ? `${formatNumber(averagePaymentDay)}-sana`
                : '-'}
            </div>
            <div className={styles['card-label']}>O'rtacha to'lov kuni</div>
          </div>
        </div>
      </div>
    </div>
  );
}