import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { formatISODate, parseISODate } from "@/lib/quarter";
import { useTranslations } from "@/lib/translations";
import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import {
  Container,
  TriggerButton,
  DisplayValue,
  Placeholder,
  CalendarCard,
  CalendarHeader,
  MonthLabel,
  NavButton,
  CalendarGrid,
  WeekdayCell,
  DayButton,
} from "./styles";
import type { DatePickerProps, CalendarDay } from "./types";

const displayFormatter = new Intl.DateTimeFormat("et-EE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
});

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}


/**
 * Builds a 6-week calendar grid for a given month view.
 * Includes days from previous/next months to fill complete weeks (Monday start).
 */
function buildCalendarGrid(viewDate: Date): CalendarDay[] {
  const firstOfMonth = startOfMonth(viewDate);
  const firstDayOffset = (firstOfMonth.getDay() + 6) % 7; // Monday start
  const startDate = new Date(firstOfMonth);
  startDate.setDate(firstOfMonth.getDate() - firstDayOffset);

  const days: CalendarDay[] = [];

  for (let i = 0; i < 42; i += 1) {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + i);

    days.push({
      date: current,
      isCurrentMonth: current.getMonth() === viewDate.getMonth(),
    });
  }

  return days;
}

export function DatePicker({ value, onChange, ariaLabel, ariaLabelledBy }: DatePickerProps) {
  const parsedValue = value ? parseISODate(value) : null;
  const [isOpen, setIsOpen] = useState(false);
  const [monthOffset, setMonthOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations("datePicker");
  
  const weekdayLabels = useMemo<readonly string[]>(
    () => (t.weekdays as readonly string[]) ?? [],
    [t.weekdays],
  );

  const viewDate = addMonths(
    startOfMonth(parsedValue ? new Date(parsedValue) : new Date()),
    monthOffset,
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  const days = buildCalendarGrid(new Date(viewDate));
  const today = (() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  })();

  const handleDaySelect = useCallback(
    (date: Date) => {
      const iso = formatISODate(date);
      onChange(iso);
      setMonthOffset(0);
      setIsOpen(false);
    },
    [onChange],
  );

  const displayValue = parsedValue ? displayFormatter.format(parsedValue) : null;

  return (
    <Container ref={containerRef}>
      <TriggerButton
        type="button"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        onClick={() => {
          setIsOpen((previous) => {
            const next = !previous;
            if (next) {
              setMonthOffset(0);
            }
            return next;
          });
        }}
      >
        {displayValue ? <DisplayValue>{displayValue}</DisplayValue> : <Placeholder>{t.selectDate}</Placeholder>}
      </TriggerButton>

      {isOpen ? (
        <CalendarCard>
          <CalendarHeader>
            <NavButton type="button" onClick={() => setMonthOffset((prev) => prev - 1)} aria-label={t.previousMonth}>
              <ChevronLeftIcon />
            </NavButton>
            <MonthLabel>{monthFormatter.format(viewDate)}</MonthLabel>
            <NavButton type="button" onClick={() => setMonthOffset((prev) => prev + 1)} aria-label={t.nextMonth}>
              <ChevronRightIcon />
            </NavButton>
          </CalendarHeader>
          <CalendarGrid>
            {weekdayLabels.map((label: string, index: number) => (
              <WeekdayCell key={`${label}-${index}`}>{label}</WeekdayCell>
            ))}
            {days.map(({ date, isCurrentMonth }) => {
              const isSelected =
                parsedValue !== null &&
                parsedValue.getFullYear() === date.getFullYear() &&
                parsedValue.getMonth() === date.getMonth() &&
                parsedValue.getDate() === date.getDate();
              const isToday =
                today.getFullYear() === date.getFullYear() &&
                today.getMonth() === date.getMonth() &&
                today.getDate() === date.getDate();

              return (
                <DayButton
                  type="button"
                  key={date.toISOString()}
                  onClick={() => handleDaySelect(date)}
                  $isCurrentMonth={isCurrentMonth}
                  $isSelected={isSelected}
                  $isToday={isToday}
                >
                  {date.getDate()}
                </DayButton>
              );
            })}
          </CalendarGrid>
        </CalendarCard>
      ) : null}
    </Container>
  );
}


