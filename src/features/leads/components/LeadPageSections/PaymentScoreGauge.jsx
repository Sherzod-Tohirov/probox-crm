import styles from '@/pages/Leads/styles/style.module.scss';

export default function PaymentScoreGauge({ paymentScore }) {
  // Get payment score style and label
  const getPaymentScoreInfo = (score) => {
    // Convert to number if it's a string
    const numScore = score != null ? Number(score) : null;

    if (numScore == null || isNaN(numScore)) {
      return { className: 'score-default', label: '-', score: '-' };
    }

    // 0.0–4.99: Yomon, 5.0–6.99: Qoniqarsiz, 7.0–8.99: Qoniqarli,
    // 9.0–9.99: Yaxshi, 10.0: Zo'r
    const scoreText = numScore.toFixed(1);

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
  const gaugeValueRaw = paymentScore != null ? Number(paymentScore) : null;
  const gaugeValue =
    gaugeValueRaw != null && !isNaN(gaugeValueRaw)
      ? Math.min(Math.max(gaugeValueRaw, 0), 10)
      : null;
  const pointerPoint =
    gaugeValue != null && !isNaN(gaugeValue)
      ? getGaugePoint(gaugeValue, gaugeMax, radius, centerX, centerY)
      : null;
  const pointerColor = getPointerColor(gaugeValue);
  const scoreInfo = getPaymentScoreInfo(gaugeValue);

  return (
    <div className={styles['score-gauge']}>
      <div className={styles['gauge-title']}>To'lov ko'rsatkichi</div>
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
  );
}
