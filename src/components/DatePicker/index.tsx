import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import theme from "@/styles/theme";
import { formatISODate, parseISODate } from "@/lib/quarter";

type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
  ariaLabelledBy?: string;
};

type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
};

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const TriggerButton = styled.button`
  width: 100%;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.input};
  padding: 0.7rem 0.85rem;
  font: inherit;
  color: ${theme.colors.foreground};
  background: ${theme.colors.tableCellBg};
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover,
  &:focus {
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 4px ${theme.colors.accentMuted};
    outline: none;
  }
`;

const DisplayValue = styled.span`
  color: ${theme.colors.foreground};
`;

const Placeholder = styled.span`
  color: ${theme.colors.foregroundMuted};
`;

const CalendarCard = styled.div`
  position: absolute;
  top: calc(100% + 0.75rem);
  left: 0;
  z-index: 20;
  width: 280px;
  background: ${theme.colors.backgroundAlt};
  border-radius: ${theme.radii.card};
  border: 1px solid rgba(31, 41, 51, 0.08);
  box-shadow: ${theme.shadows.card};
  padding: 1rem;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const MonthLabel = styled.span`
  font-weight: 600;
  color: ${theme.colors.foreground};
`;

const NavButton = styled.button`
  border: none;
  background: transparent;
  color: ${theme.colors.foreground};
  font-size: 1rem;
  padding: 0.25rem;
  cursor: pointer;
  border-radius: ${theme.radii.input};
  transition: background 0.2s ease;

  &:hover {
    background: ${theme.colors.accentBadge};
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
`;

const WeekdayCell = styled.span`
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${theme.colors.foregroundMuted};
  padding-bottom: 0.25rem;
`;

const DayButton = styled.button<{
  $isCurrentMonth: boolean;
  $isSelected: boolean;
  $isToday: boolean;
}>`
  height: 2.25rem;
  border-radius: ${theme.radii.input};
  border: none;
  cursor: pointer;
  font: inherit;
  color: ${({ $isCurrentMonth, $isSelected }) =>
    $isSelected ? "#ffffff" : $isCurrentMonth ? theme.colors.foreground : theme.colors.foregroundMuted};
  background: ${({ $isSelected, $isToday }) => {
    if ($isSelected) return theme.colors.accent;
    if ($isToday) return theme.colors.accentBadge;
    return "transparent";
  }};
  transition: transform 0.18s ease, background 0.18s ease, color 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ $isSelected }) => ($isSelected ? theme.colors.accent : theme.colors.accentBadge)};
  }
`;

const dayFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
});

const weekdayLabels = ["M", "T", "W", "T", "F", "S", "S"];

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

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

  const displayValue = parsedValue ? dayFormatter.format(parsedValue) : null;

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
        {displayValue ? <DisplayValue>{displayValue}</DisplayValue> : <Placeholder>Select date</Placeholder>}
      </TriggerButton>

      {isOpen ? (
        <CalendarCard>
          <CalendarHeader>
            <NavButton type="button" onClick={() => setMonthOffset((prev) => prev - 1)} aria-label="Previous month">
              ←
            </NavButton>
            <MonthLabel>{monthFormatter.format(viewDate)}</MonthLabel>
            <NavButton type="button" onClick={() => setMonthOffset((prev) => prev + 1)} aria-label="Next month">
              →
            </NavButton>
          </CalendarHeader>
          <CalendarGrid>
            {weekdayLabels.map((label) => (
              <WeekdayCell key={label}>{label}</WeekdayCell>
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


