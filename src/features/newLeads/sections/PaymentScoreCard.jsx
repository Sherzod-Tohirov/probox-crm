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
import PaymentScoreGauge from '@components/ui/PaymentScoreGauge';

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
          className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border"
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
            className="rounded-[6px] min-w-[44px] h-[22px] px-[8px] py-[2px] text-[12px] text-center font-semibold"
            style={badgeStyle}
          >
            {badge}
          </span>
        ) : null}
      </div>
      <p
        className={`truncate text-[20px] leading-[28px] font-bold ${valueClassName || ''}`}
        style={{ color: valueColor }}
      >
        {value}
      </p>
      <span
        className="truncate text-[12px] leading-[16px]"
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
            <PaymentScoreGauge score={paymentScore} />
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
