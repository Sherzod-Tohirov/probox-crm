import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { uz } from "date-fns/locale";

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/shadcn/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames()
  const uzMonths = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ]
  const toUzbekLabel = (date) => {
    return `${uzMonths[date.getMonth()]} ${date.getFullYear()}`
  }

  return (
    <DayPicker
      locale={uz}
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar rounded-[18px] border border-[var(--primary-border-color)] bg-[var(--primary-bg)] p-[14px] [--cell-size:56px] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          uzMonths[date.getMonth()].slice(0, 3),
        formatCaption: (date) => toUzbekLabel(date),
        ...formatters,
      }}
      classNames={{
        root: cn("w-full", defaultClassNames.root),
        months: cn("relative flex w-full flex-col gap-[18px] md:flex-row md:gap-[22px]", defaultClassNames.months),
        month: cn("flex w-full min-w-[300px] flex-col gap-[12px]", defaultClassNames.month),
        nav: cn(
          "pointer-events-none absolute inset-x-0 top-0 flex w-full items-center justify-between",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "pointer-events-auto h-[40px] w-[40px] select-none rounded-[12px] border border-[var(--primary-border-color)] bg-[var(--primary-bg)] p-0 text-[var(--secondary-color)] aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "pointer-events-auto h-[40px] w-[40px] select-none rounded-[12px] border border-[var(--primary-border-color)] bg-[var(--primary-bg)] p-0 text-[var(--secondary-color)] aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-[40px] w-full items-center justify-center px-[44px]",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-[--cell-size] w-full items-center justify-center gap-[6px] text-[14px] font-semibold",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn("bg-popover absolute inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn("select-none font-semibold", captionLayout === "label"
          ? "text-[20px] text-[var(--primary-color)] leading-none"
          : "[&>svg]:text-muted-foreground flex h-[32px] items-center gap-[4px] rounded-[8px] pl-[8px] pr-[6px] text-[14px] [&>svg]:h-[14px] [&>svg]:w-[14px]", defaultClassNames.caption_label),
        table: "w-full border-collapse",
        weekdays: cn("flex mb-[8px]", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 select-none rounded-[6px] text-[15px] font-medium text-[var(--calendar-weekday-color)]",
          defaultClassNames.weekday
        ),
        week: cn("mt-[6px] flex w-full", defaultClassNames.week),
        week_number_header: cn("w-[--cell-size] select-none", defaultClassNames.week_number_header),
        week_number: cn(
          "text-muted-foreground select-none text-[12px]",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-[16px] [&:last-child[data-selected=true]_button]:rounded-r-[16px]",
          defaultClassNames.day
        ),
        range_start: cn("bg-[var(--calendar-range-bg)] rounded-l-[16px]", defaultClassNames.range_start),
        range_middle: cn("bg-[var(--calendar-range-bg)] rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-[var(--calendar-range-bg)] rounded-r-[16px]", defaultClassNames.range_end),
        today: cn(
          "text-[var(--primary-color)]",
          defaultClassNames.today
        ),
        outside: cn(
          "text-[var(--calendar-outside-color)] aria-selected:text-[var(--calendar-outside-color)]",
          defaultClassNames.outside
        ),
        disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (<div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />);
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (<ChevronLeftIcon className={cn("h-[16px] w-[16px]", className)} {...props} />);
          }

          if (orientation === "right") {
            return (<ChevronRightIcon className={cn("h-[16px] w-[16px]", className)} {...props} />);
          }

          return (<ChevronDownIcon className={cn("h-[16px] w-[16px]", className)} {...props} />);
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div
                className="flex size-[--cell-size] items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props} />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 rounded-[16px] border border-transparent bg-transparent px-0 py-0 text-[16px] font-medium leading-none text-[var(--primary-color)] transition-colors data-[selected-single=true]:border-transparent data-[selected-single=true]:bg-[var(--calendar-selected-bg)] data-[selected-single=true]:text-[var(--calendar-selected-color)] data-[range-start=true]:border-transparent data-[range-start=true]:bg-[var(--calendar-selected-bg)] data-[range-start=true]:text-[var(--calendar-selected-color)] data-[range-end=true]:border-transparent data-[range-end=true]:bg-[var(--calendar-selected-bg)] data-[range-end=true]:text-[var(--calendar-selected-color)] data-[range-middle=true]:bg-[var(--calendar-range-bg)] data-[range-middle=true]:text-[var(--primary-color)] group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10",
        defaultClassNames.day,
        className
      )}
      {...props} />
  );
}

export { Calendar, CalendarDayButton }
