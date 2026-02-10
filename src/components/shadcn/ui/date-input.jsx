'use client';

import * as React from 'react';
import { Button } from '@/components/shadcn/ui/button';
import { Calendar } from '@/components/shadcn/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/shadcn/ui/popover';
import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import moment from 'moment';

function normalizeDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;

  // Keep this tolerant because existing state may contain mixed formats.
  const parsed = moment(value, ['YYYY-MM-DD', 'DD.MM.YYYY', moment.ISO_8601], true);
  if (parsed.isValid()) return parsed.toDate();

  const fallback = new Date(value);
  if (!Number.isNaN(fallback.getTime())) return fallback;
  return null;
}

function formatMonthLabel(date) {
  if (!date) return 'Sanani tanlang';
  const monthsUz = [
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
  const day = date.getDate();
  const month = monthsUz[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

export function DateInput({ value, onChange, className }) {
  const isControlled = value !== undefined;
  const [internalDate, setInternalDate] = React.useState(() =>
    normalizeDate(value)
  );

  React.useEffect(() => {
    if (isControlled) {
      setInternalDate(normalizeDate(value));
    }
  }, [isControlled, value]);

  const selectedDate = isControlled ? normalizeDate(value) : internalDate;

  const handleSelect = (nextDate) => {
    if (!isControlled) {
      setInternalDate(nextDate);
    }

    if (onChange) {
      // Store as canonical ISO-like date to avoid parsing inconsistencies.
      onChange(nextDate ? format(nextDate, 'yyyy-MM-dd') : null);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!selectedDate}
          className={`h-[40px] min-w-[200px] rounded-[8px] border border-[var(--primary-border-color)] bg-[var(--primary-bg)] px-[18px] text-[16px] font-medium text-[var(--primary-color)] shadow-none data-[empty=true]:text-[var(--secondary-color)] hover:bg-[var(--primary-bg)] ${className || ''}`}
        >
          {formatMonthLabel(selectedDate)}
          <ChevronDownIcon className="h-[20px] w-[20px] text-[var(--secondary-color)]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto rounded-[14px] border border-[var(--primary-border-color)] bg-[var(--primary-bg)] p-[10px]"
        align="end"
      >
        <Calendar
          mode="single"
          selected={selectedDate ?? undefined}
          onSelect={handleSelect}
          defaultMonth={selectedDate ?? undefined}
        />
      </PopoverContent>
    </Popover>
  );
}
