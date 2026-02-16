import { Card, CardContent } from '@/components/shadcn/ui/card';
import { formatCurrencyUZS } from '@/features/leads/utils/deviceUtils';

function GaugeChart({ score }) {
  const gaugeMax = 10;
  const centerX = 100;
  const centerY = 100;
  const radius = 80;

  const getPoint = (value) => {
    const pct = value / gaugeMax;
    const angle = 180 - pct * 180;
    const rad = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(rad),
      y: centerY - radius * Math.sin(rad),
      rad,
    };
  };

  const gap = 0.15;
  const p0 = getPoint(0);
  const p4 = getPoint(4);
  const p5s = getPoint(4 + gap);
  const p6 = getPoint(6);
  const p7s = getPoint(6 + gap);
  const p9 = getPoint(9);
  const p9s = getPoint(9 + gap);
  const p10 = getPoint(10);

  const numScore = score != null ? Number(score) : null;
  const isValid = numScore != null && !isNaN(numScore) && Number.isFinite(numScore);
  const clamped = isValid ? Math.min(Math.max(numScore, 0), 10) : null;

  const getColor = (v) => {
    if (v == null) return '#9ca3af';
    if (v < 5) return '#ef4444';
    if (v < 7) return '#f97316';
    if (v < 9) return '#eab308';
    if (v < 10) return '#22c55e';
    return '#1CF271';
  };

  const getLabel = (v) => {
    if (v == null) return '-';
    if (v < 5) return 'Yomon';
    if (v < 7) return 'Qoniqarsiz';
    if (v < 9) return 'Qoniqarli';
    if (v < 10) return 'Yaxshi';
    return "Zo'r";
  };

  const pointer = clamped != null ? getPoint(clamped) : null;
  const color = getColor(clamped);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-[160px]">
        <path
          d={`M ${p0.x} ${p0.y} A ${radius} ${radius} 0 0 1 ${p10.x} ${p10.y}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d={`M ${p0.x} ${p0.y} A ${radius} ${radius} 0 0 1 ${p4.x} ${p4.y}`}
          fill="none"
          stroke="#ef4444"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d={`M ${p5s.x} ${p5s.y} A ${radius} ${radius} 0 0 1 ${p6.x} ${p6.y}`}
          fill="none"
          stroke="#f97316"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d={`M ${p7s.x} ${p7s.y} A ${radius} ${radius} 0 0 1 ${p9.x} ${p9.y}`}
          fill="none"
          stroke="#eab308"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d={`M ${p9s.x} ${p9s.y} A ${radius} ${radius} 0 0 1 ${p10.x} ${p10.y}`}
          fill="none"
          stroke="#22c55e"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {pointer && (
          <g transform={`translate(${centerX}, ${centerY})`}>
            <circle
              cx={Math.cos(pointer.rad) * 78}
              cy={-Math.sin(pointer.rad) * 78}
              r="8"
              fill={color}
              stroke="#fff"
              strokeWidth="2.5"
            />
            <circle
              cx={Math.cos(pointer.rad) * 78}
              cy={-Math.sin(pointer.rad) * 78}
              r="3"
              fill="#fff"
            />
          </g>
        )}
      </svg>
      <div className="mt-[-8px] text-center">
        <div className="text-[28px] font-bold" style={{ color: 'var(--primary-color)' }}>
          {clamped != null ? clamped.toFixed(1) : '-'}
        </div>
        <div className="flex items-center justify-between gap-[40px] text-[11px]" style={{ color: 'var(--secondary-color)' }}>
          <span>0</span>
          <span className="text-[12px] font-semibold" style={{ color }}>{getLabel(clamped)}</span>
          <span>10</span>
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, color, icon, percentage }) {
  return (
    <div className="flex flex-col items-center gap-[6px] rounded-[14px] border border-[var(--primary-border-color)] bg-[var(--primary-bg)] px-[16px] py-[14px]">
      {icon && (
        <div className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px]" style={{ backgroundColor: color ? `${color}15` : undefined, color }}>
          {icon}
        </div>
      )}
      {percentage != null && (
        <span className="text-[11px] font-semibold" style={{ color }}>{percentage}%</span>
      )}
      <span className="text-[16px] font-bold" style={{ color: color || 'var(--primary-color)' }}>{value}</span>
      <span className="text-center text-[11px] leading-tight" style={{ color: 'var(--secondary-color)' }}>{label}</span>
    </div>
  );
}

export default function PaymentScoreCard({
  paymentScore,
  totalSum = 0,
  closedSum = 0,
  overdueDebt = 0,
  totalContracts = 0,
  openContracts = 0,
  longestDelay = 0,
  averagePaymentDay = 0,
}) {
  const fmt = (n) => (n ? formatCurrencyUZS(n) : '0 uzs');

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-[16px] lg:flex-row lg:items-start">
          {/* Gauge */}
          <div className="flex flex-col items-center gap-[4px]">
            <span className="text-[13px] font-semibold" style={{ color: 'var(--secondary-color)' }}>
              To'lov ko'rsatkichi
            </span>
            <GaugeChart score={paymentScore} />
          </div>

          {/* Amount cards */}
          <div className="flex flex-1 flex-col gap-[12px]">
            <div className="grid grid-cols-3 gap-[10px]">
              <div className="flex flex-col gap-[4px] rounded-[14px] bg-emerald-500/10 px-[14px] py-[12px]">
                <span className="text-[17px] font-bold text-emerald-600">{fmt(totalSum)}</span>
                <span className="text-[11px] text-emerald-600/70">Umumiy summa</span>
              </div>
              <div className="flex flex-col gap-[4px] rounded-[14px] bg-blue-500/10 px-[14px] py-[12px]">
                <span className="text-[11px] text-blue-500/70">
                  {closedSum && totalSum ? Math.round((closedSum / totalSum) * 100) : 0}%
                </span>
                <span className="text-[17px] font-bold text-blue-600">{fmt(closedSum)}</span>
                <span className="text-[11px] text-blue-600/70">Yopilgan summa</span>
              </div>
              <div className="flex flex-col gap-[4px] rounded-[14px] bg-red-500/10 px-[14px] py-[12px]">
                <span className="text-[17px] font-bold text-red-500">{fmt(overdueDebt)}</span>
                <span className="text-[11px] text-red-500/70">Muddati o'tgan qarz</span>
              </div>
            </div>

            {/* Bottom stats */}
            <div className="grid grid-cols-4 gap-[10px]">
              <StatCard value={totalContracts || 0} label="Umumiy shartnomalar" />
              <StatCard value={openContracts || 0} label="Ochiq shartnomalar" />
              <StatCard
                value={longestDelay > 0 ? `${longestDelay} kun` : '-'}
                label="Eng cho'zgan kuni"
              />
              <StatCard
                value={averagePaymentDay != null && !isNaN(averagePaymentDay) ? `${averagePaymentDay}-sana` : '-'}
                label="O'rtacha to'lov kuni"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
