'use client';

import * as React from 'react';
import { Button } from '@/components/shadcn/ui/button';
import { Calendar } from '@/components/shadcn/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/shadcn/ui/popover';
import { ChevronDownIcon } from 'lucide-react';
import moment from 'moment';

const MONTHS_UZ = [
  'Yanvar',
  'Fevral',
  'Mart',
  'Aprel',
  'May',
  'Iyun',
  'Iyul',
  'Avgust',
  'Sentabr',
  'Oktabr',
  'Noyabr',
  'Dekabr',
];

function normalizeDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;

  const parsed = moment(
    value,
    [
      'DD.MM.YYYY HH:mm',
      'DD.MM.YYYY',
      'YYYY-MM-DD HH:mm',
      'YYYY-MM-DD',
      moment.ISO_8601,
    ],
    true
  );
  if (parsed.isValid()) return parsed.toDate();

  const fallback = new Date(value);
  if (!Number.isNaN(fallback.getTime())) return fallback;
  return null;
}

function formatLabel(date, withTime) {
  if (!date) return 'Sanani tanlang';
  const day = String(date.getDate()).padStart(2, '0');
  const month = MONTHS_UZ[date.getMonth()];
  const year = date.getFullYear();
  if (!withTime) return `${month} ${day}, ${year}`;
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${month} ${day}, ${year} ${hh}:${mm}`;
}

function formatOutput(date, withTime) {
  if (!date) return null;
  const dd = String(date.getDate()).padStart(2, '0');
  const mo = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  if (!withTime) return `${dd}.${mo}.${yyyy}`;
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${dd}.${mo}.${yyyy} ${hh}:${mm}`;
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

export function DateInput({
  value,
  onChange,
  className,
  withTime = false,
  disabled = false,
}) {
  const isControlled = value !== undefined;

  const [internalDate, setInternalDate] = React.useState(() =>
    normalizeDate(value)
  );
  const [open, setOpen] = React.useState(false);
  const [hour, setHour] = React.useState(() => {
    const d = normalizeDate(value);
    return d ? d.getHours() : 0;
  });
  const [minute, setMinute] = React.useState(() => {
    const d = normalizeDate(value);
    return d ? d.getMinutes() : 0;
  });

  React.useEffect(() => {
    if (isControlled) {
      const d = normalizeDate(value);
      setInternalDate(d);
      if (d) {
        setHour(d.getHours());
        setMinute(d.getMinutes());
      }
    }
  }, [isControlled, value]);

  const selectedDate = isControlled ? normalizeDate(value) : internalDate;

  const emitChange = React.useCallback(
    (date, h, m) => {
      if (!onChange || !date) return;
      const next = new Date(date);
      if (withTime) {
        next.setHours(h ?? hour);
        next.setMinutes(m ?? minute);
        next.setSeconds(0);
        next.setMilliseconds(0);
      }
      onChange(formatOutput(next, withTime));
    },
    [onChange, withTime, hour, minute]
  );

  const handleSelectDay = (nextDate) => {
    if (!isControlled) setInternalDate(nextDate);
    emitChange(nextDate, hour, minute);
    if (!withTime) setOpen(false);
  };

  const handleHourChange = (e) => {
    const h = clamp(Number(e.target.value.replace(/\D/g, '') || 0), 0, 23);
    setHour(h);
    emitChange(selectedDate, h, minute);
  };

  const handleMinuteChange = (e) => {
    const m = clamp(Number(e.target.value.replace(/\D/g, '') || 0), 0, 59);
    setMinute(m);
    emitChange(selectedDate, hour, m);
  };

  return (
    <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          data-empty={!selectedDate}
          className={`h-[40px] w-full justify-between rounded-[8px] border border-[var(--primary-border-color)] bg-[var(--primary-bg)] px-[12px] text-[14px] font-medium text-[var(--primary-color)] shadow-none data-[empty=true]:text-[var(--secondary-color)] hover:bg-[var(--primary-bg)] ${className || ''}`}
        >
          {formatLabel(selectedDate, withTime)}
          <ChevronDownIcon className="h-[16px] w-[16px] shrink-0 text-[var(--secondary-color)]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto rounded-[14px] border border-[var(--primary-border-color)] bg-[var(--primary-bg)] p-[10px]"
        align="start"
      >
        <Calendar
          mode="single"
          selected={selectedDate ?? undefined}
          onSelect={handleSelectDay}
          defaultMonth={selectedDate ?? undefined}
        />

        {withTime && (
          <div
            className="mt-[8px] flex items-center justify-center gap-[8px] border-t pt-[10px]"
            style={{ borderColor: 'var(--primary-border-color)' }}
          >
            <span
              className="text-[12px]"
              style={{ color: 'var(--secondary-color)' }}
            >
              Vaqt:
            </span>
            <input
              type="number"
              min={0}
              max={23}
              value={String(hour).padStart(2, '0')}
              onChange={handleHourChange}
              className="h-[32px] w-[44px] rounded-[6px] border text-center text-[13px] font-semibold outline-none"
              style={{
                borderColor: 'var(--primary-border-color)',
                backgroundColor: 'var(--primary-input-bg)',
                color: 'var(--primary-color)',
              }}
            />
            <span
              className="text-[14px] font-bold"
              style={{ color: 'var(--primary-color)' }}
            >
              :
            </span>
            <input
              type="number"
              min={0}
              max={59}
              value={String(minute).padStart(2, '0')}
              onChange={handleMinuteChange}
              className="h-[32px] w-[44px] rounded-[6px] border text-center text-[13px] font-semibold outline-none"
              style={{
                borderColor: 'var(--primary-border-color)',
                backgroundColor: 'var(--primary-input-bg)',
                color: 'var(--primary-color)',
              }}
            />
            <Button
              type="button"
              size="sm"
              className="h-[32px] px-[12px] text-[12px]"
              onClick={() => setOpen(false)}
            >
              Tayyor
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
