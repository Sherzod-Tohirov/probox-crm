import { Card, CardContent } from '@/components/shadcn/ui/card';
import {
  BadgeCheck,
  ReceiptText,
  Files,
  CalendarDays,
  CalendarClock,
  Wallet,
} from 'lucide-react';
import formatterCurrency from '@/utils/formatterCurrency';

function GaugeChart({ score }) {
  const gaugeMax = 10;
  const centerX = 100;
  const centerY = 100;
  const radius = 80;
  const palette = {
    panelBg: 'var(--primary-input-bg)',
    panelBorder: 'var(--primary-border-color)',
    title: 'var(--secondary-color)',
    track: 'var(--primary-border-color)',
    value: 'var(--primary-color)',
    scale: 'var(--secondary-color)',
    pointerRing: 'var(--primary-bg)',
    gaugeUnknown: 'var(--secondary-color)',
    gaugeDanger: 'var(--payment-gauge-danger)',
    gaugeWarning: 'var(--payment-gauge-warning)',
    gaugeCaution: 'var(--payment-gauge-caution)',
    gaugeGood: 'var(--payment-gauge-good)',
    gaugeExcellent: 'var(--payment-gauge-excellent)',
  };

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
  const pZorStart = getPoint(9.7);

  const numScore = score != null ? Number(score) : null;
  const isValid =
    numScore != null && !isNaN(numScore) && Number.isFinite(numScore);
  const clamped = isValid ? Math.min(Math.max(numScore, 0), 10) : null;

  const getColor = (v) => {
    if (v == null) return palette.gaugeUnknown;
    if (v < 5) return palette.gaugeDanger;
    if (v < 7) return palette.gaugeWarning;
    if (v < 9) return palette.gaugeCaution;
    if (v < 10) return palette.gaugeGood;
    return palette.gaugeExcellent;
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
    <div
      className="flex flex-col h-full justify-center items-center rounded-[18px] border px-[16px] py-[14px]"
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
        <path
          d={`M ${p0.x} ${p0.y} A ${radius} ${radius} 0 0 1 ${p10.x} ${p10.y}`}
          fill="none"
          stroke={palette.track}
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d={`M ${p0.x} ${p0.y} A ${radius} ${radius} 0 0 1 ${p4.x} ${p4.y}`}
          fill="none"
          stroke={palette.gaugeDanger}
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d={`M ${p5s.x} ${p5s.y} A ${radius} ${radius} 0 0 1 ${p6.x} ${p6.y}`}
          fill="none"
          stroke={palette.gaugeWarning}
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d={`M ${p7s.x} ${p7s.y} A ${radius} ${radius} 0 0 1 ${p9.x} ${p9.y}`}
          fill="none"
          stroke={palette.gaugeCaution}
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d={`M ${p9s.x} ${p9s.y} A ${radius} ${radius} 0 0 1 ${pZorStart.x} ${pZorStart.y}`}
          fill="none"
          stroke={palette.gaugeGood}
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d={`M ${pZorStart.x} ${pZorStart.y} A ${radius} ${radius} 0 0 1 ${p10.x} ${p10.y}`}
          fill="none"
          stroke={palette.gaugeExcellent}
          strokeWidth="12"
          strokeLinecap="round"
        />
        {pointer && (
          <g transform={`translate(${centerX}, ${centerY})`}>
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
        <text
          x={centerX}
          y={centerY - 10}
          textAnchor="middle"
          className="text-[30px] font-bold"
          style={{ fill: palette.value, fontFamily: 'inherit' }}
        >
          {clamped != null ? clamped.toFixed(1) : '-'}
        </text>
        <text
          x={centerX}
          y={centerY + 26}
          textAnchor="middle"
          className="text-[12px] font-semibold"
          style={{ fill: color, fontFamily: 'inherit' }}
        >
          {getLabel(clamped)}
        </text>
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

function MetricCard({
  icon: Icon,
  value,
  label,
  valueColor = 'var(--primary-color)',
  badge,
  badgeStyle,
  iconColor = 'var(--secondary-color)',
  labelColor = 'var(--secondary-color)',
  minHeightClassName = 'min-h-[128px]',
  valueClassName,
}) {
  return (
    <div
      className={`relative flex flex-col gap-[7px] rounded-[16px] border px-[14px] py-[12px] ${minHeightClassName}`}
      style={{
        backgroundColor: 'var(--primary-input-bg)',
        borderColor: 'var(--primary-border-color)',
      }}
    >
      <div className="flex items-start justify-between gap-[8px]">
        <div
          className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] border"
          style={{
            color: iconColor,
            backgroundColor: 'var(--primary-bg)',
            borderColor: 'var(--primary-border-color)',
          }}
        >
          <Icon size={15} />
        </div>
        {badge ? (
          <span
            className="rounded-[10px] px-[8px] py-[2px] text-[10px] font-semibold"
            style={badgeStyle}
          >
            {badge}
          </span>
        ) : null}
      </div>
      <span
        className={`truncate text-[17px] font-bold ${valueClassName || ''}`}
        style={{ color: valueColor }}
      >
        {value}
      </span>
      <span
        className="truncate text-[11px] leading-tight"
        style={{ color: labelColor }}
      >
        {label}
      </span>
    </div>
  );
}

function TopAmountCard({
  icon,
  value,
  label,
  valueColor,
  iconColor,
  badge,
  badgeTone = 'neutral',
}) {
  const badgeStyleMap = {
    green: {
      backgroundColor: 'var(--success-bg)',
      color: 'var(--success-color)',
    },
    neutral: {
      backgroundColor: 'var(--primary-bg)',
      color: 'var(--secondary-color)',
      border: '1px solid var(--primary-border-color)',
    },
  };

  return (
    <MetricCard
      icon={icon}
      value={value}
      label={label}
      valueColor={valueColor}
      iconColor={iconColor}
      badge={badge}
      badgeStyle={badgeStyleMap[badgeTone]}
      minHeightClassName="min-h-[112px]"
    />
  );
}

function BottomStatCard({
  icon,
  value,
  label,
  badge,
  badgeTone = 'neutral',
  valueColor,
}) {
  const badgeStyleMap = {
    green: {
      backgroundColor: 'var(--success-bg)',
      color: 'var(--success-color)',
    },
    neutral: {
      backgroundColor: 'var(--primary-bg)',
      color: 'var(--secondary-color)',
      border: '1px solid var(--primary-border-color)',
    },
  };

  return (
    <MetricCard
      icon={icon}
      value={value}
      label={label}
      valueColor={valueColor}
      badge={badge}
      badgeStyle={badge ? badgeStyleMap[badgeTone] : undefined}
      minHeightClassName="min-h-[104px]"
    />
  );
}

function formatUzs(value) {
  const num = Number(value || 0);
  const formatted = formatterCurrency(num, {
    maximumFractionDigits: 0,
  }).replace(/\u00A0/g, ' ');

  return `${formatted} uzs`;
}

function formatNumber(value) {
  return formatterCurrency(Number(value || 0), {
    maximumFractionDigits: 0,
  }).replace(/\u00A0/g, ' ');
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
  const closedPercent =
    closedSum && totalSum ? Math.round((closedSum / totalSum) * 100) : 0;
  const openPercent =
    openContracts && totalContracts
      ? Math.round((openContracts / totalContracts) * 100)
      : 0;

  const averageDayLabel =
    averagePaymentDay != null && !isNaN(averagePaymentDay)
      ? `${averagePaymentDay}-sana`
      : '-';

  return (
    <Card
      className="p-[12px]"
      style={{
        backgroundColor: 'var(--secondary-bg)',
        borderColor: 'var(--primary-border-color)',
      }}
    >
      <CardContent>
        <div className="grid gap-[12px] xl:grid-cols-[250px_1fr]">
          <div className="h-full">
            <GaugeChart score={paymentScore} />
          </div>
          <div className="flex flex-col gap-[12px]">
            <div className="grid gap-[12px] md:grid-cols-3">
              <TopAmountCard
                icon={Wallet}
                value={formatUzs(totalSum)}
                label="Umumiy summa"
                valueColor="var(--info-color)"
                iconColor="var(--info-color)"
              />
              <TopAmountCard
                icon={BadgeCheck}
                value={formatUzs(closedSum)}
                label="Yopilgan summa"
                valueColor="var(--success-color)"
                iconColor="var(--success-color)"
                badge={`${closedPercent}%`}
                badgeTone="green"
              />
              <TopAmountCard
                icon={ReceiptText}
                value={formatUzs(overdueDebt)}
                label="Muddati o'tgan qarz.(Rassrochka)"
                valueColor="var(--danger-color)"
                iconColor="var(--danger-color)"
              />
            </div>

            <div className="grid gap-[12px] sm:grid-cols-2 xl:grid-cols-4">
              <BottomStatCard
                icon={Files}
                value={formatNumber(totalContracts)}
                label="Umumiy shartnomalar"
              />
              <BottomStatCard
                icon={Files}
                value={formatNumber(openContracts)}
                label="Ochiq shartnomalar"
                badge={`${openPercent}%`}
              />
              <BottomStatCard
                icon={CalendarDays}
                value={
                  longestDelay > 0 ? `${formatNumber(longestDelay)} kun` : '-'
                }
                label="Eng cho'zgan kuni"
              />
              <BottomStatCard
                icon={CalendarClock}
                value={averageDayLabel}
                label="O'rtacha to'lov kuni"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
