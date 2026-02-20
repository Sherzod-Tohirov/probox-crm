const GAUGE_MAX = 10;
const CENTER_X = 100;
const CENTER_Y = 100;
const RADIUS = 80;

const palette = {
  panelBg: 'var(--primary-input-bg)',
  panelBorder: 'var(--primary-border-color)',
  title: 'var(--secondary-color)',
  track: 'var(--primary-border-color)',
  value: 'var(--primary-color)',
  scale: 'var(--secondary-color)',
  pointerRing: 'var(--primary-bg)',
};

const SEGMENTS = [
  { from: 0, to: 4, color: '#ef4444' },
  { from: 4.15, to: 6, color: '#f97316' },
  { from: 6.15, to: 9, color: '#eab308' },
  { from: 9.15, to: 9.7, color: '#22c55e' },
  { from: 9.7, to: 10, color: '#1CF271' },
];

function getPoint(value) {
  const pct = value / GAUGE_MAX;
  const angle = 180 - pct * 180;
  const rad = (angle * Math.PI) / 180;
  return {
    x: CENTER_X + RADIUS * Math.cos(rad),
    y: CENTER_Y - RADIUS * Math.sin(rad),
    rad,
  };
}

function getColor(v) {
  if (v == null) return '#9ca3af';
  if (v < 5) return '#ef4444';
  if (v < 7) return '#f97316';
  if (v < 9) return '#eab308';
  if (v < 10) return '#22c55e';
  return '#1CF271';
}

function getLabel(v) {
  if (v == null) return '-';
  if (v < 5) return 'Yomon';
  if (v < 7) return 'Qoniqarsiz';
  if (v < 9) return 'Qoniqarli';
  if (v < 10) return 'Yaxshi';
  return "Zo'r";
}

const p0 = getPoint(0);
const p10 = getPoint(10);

export default function PaymentScoreGauge({ score, className = '' }) {
  const numScore = score != null ? Number(score) : null;
  const isValid =
    numScore != null &&
    !isNaN(numScore) &&
    Number.isFinite(numScore) &&
    String(score) !== 'null' &&
    String(score) !== 'undefined';
  const clamped = isValid ? Math.min(Math.max(numScore, 0), 10) : null;
  const pointer = clamped != null ? getPoint(clamped) : null;
  const color = getColor(clamped);

  return (
    <div
      className={`flex flex-col h-full justify-center items-center rounded-[18px] border px-[16px] py-[14px] ${className}`}
      style={{
        backgroundColor: palette.panelBg,
        borderColor: palette.panelBorder,
      }}
    >
      <h3
        className="mb-[10px] whitespace-nowrap text-center text-[15px] font-semibold leading-[20px]"
        style={{ color: palette.title }}
      >
        To'lov ko'rsatkichi
      </h3>
      <svg viewBox="0 0 200 140" className="w-[164px]">
        {/* Track */}
        <path
          d={`M ${p0.x} ${p0.y} A ${RADIUS} ${RADIUS} 0 0 1 ${p10.x} ${p10.y}`}
          fill="none"
          stroke={palette.track}
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Colored segments */}
        {SEGMENTS.map((seg) => {
          const a = getPoint(seg.from);
          const b = getPoint(seg.to);
          return (
            <path
              key={seg.from}
              d={`M ${a.x} ${a.y} A ${RADIUS} ${RADIUS} 0 0 1 ${b.x} ${b.y}`}
              fill="none"
              stroke={seg.color}
              strokeWidth="12"
              strokeLinecap="round"
            />
          );
        })}
        {/* Pointer */}
        {pointer && (
          <g transform={`translate(${CENTER_X}, ${CENTER_Y})`}>
            <circle
              cx={Math.cos(pointer.rad) * 78}
              cy={-Math.sin(pointer.rad) * 78}
              r="9"
              fill={color}
              stroke={palette.pointerRing}
              strokeWidth="3"
            />
            <circle
              cx={Math.cos(pointer.rad) * 78}
              cy={-Math.sin(pointer.rad) * 78}
              r="3.5"
              fill={palette.pointerRing}
            />
          </g>
        )}
        {/* Score value */}
        <text
          x={CENTER_X}
          y={CENTER_Y - 10}
          textAnchor="middle"
          className="text-[30px] font-bold"
          style={{ fill: palette.value, fontFamily: 'inherit' }}
        >
          {clamped != null ? clamped.toFixed(1) : '-'}
        </text>
        {/* Label */}
        <text
          x={CENTER_X}
          y={CENTER_Y + 26}
          textAnchor="middle"
          className="text-[12px] font-semibold"
          style={{ fill: color, fontFamily: 'inherit' }}
        >
          {getLabel(clamped)}
        </text>
        {/* Scale anchors */}
        <text
          x="14"
          y="125"
          textAnchor="start"
          className="text-[14px]"
          style={{ fill: palette.scale, fontFamily: 'inherit' }}
        >
          0
        </text>
        <text
          x="185"
          y="125"
          textAnchor="end"
          className="text-[14px]"
          style={{ fill: palette.scale, fontFamily: 'inherit' }}
        >
          10
        </text>
      </svg>
    </div>
  );
}
