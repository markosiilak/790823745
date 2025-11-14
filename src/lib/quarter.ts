const MS_IN_DAY = 24 * 60 * 60 * 1000;

export type QuarterKey = {
  year: number;
  quarter: number;
};

export type WeekInfo = {
  start: Date;
  end: Date;
  isoWeek: number;
  month: number;
};

export type MonthInfo = {
  month: number;
  name: string;
  weeks: WeekInfo[];
};

export type QuarterStructure = QuarterKey & {
  label: string;
  months: MonthInfo[];
  weeks: WeekInfo[];
};

const monthFormatter = new Intl.DateTimeFormat("en", { month: "long" });

/**
 * Determines which quarter a given date belongs to.
 * Quarters are calculated as: Q1 (Jan-Mar), Q2 (Apr-Jun), Q3 (Jul-Sep), Q4 (Oct-Dec).
 */
export function getQuarterFromDate(date: Date): QuarterKey {
  const month = date.getMonth();
  const quarter = Math.floor(month / 3) + 1;
  return { year: date.getFullYear(), quarter };
}

/**
 * Shifts a quarter forward or backward by a specified number of quarters.
 * Handles year boundaries automatically (e.g., Q4 2025 + 1 = Q1 2026).
 */
export function shiftQuarter({ year, quarter }: QuarterKey, delta: number): QuarterKey {
  const totalQuarters = year * 4 + (quarter - 1) + delta;
  const nextYear = Math.floor(totalQuarters / 4);
  const nextQuarter = (totalQuarters % 4) + 1;
  return { year: nextYear, quarter: nextQuarter };
}

/**
 * Builds a complete quarter structure with all weeks and months.
 * Generates week information following ISO-8601 standard (Monday start, week 1 contains Thursday).
 * Weeks are assigned to the month they mostly occupy.
 */
export function buildQuarterStructure(year: number, quarter: number): QuarterStructure {
  const quarterIndex = quarter - 1;
  const firstMonth = quarterIndex * 3;
  const quarterMonths = [firstMonth, firstMonth + 1, firstMonth + 2];

  const quarterStart = new Date(year, firstMonth, 1);
  const quarterEnd = new Date(year, firstMonth + 3, 0);

  const weeks = collectWeeksForQuarter(quarterStart, quarterEnd, quarterMonths);
  const months = quarterMonths.map((month) => ({
    month,
    name: monthFormatter.format(new Date(year, month, 1)),
    weeks: weeks.filter((week) => week.month === month),
  }));

  return {
    year,
    quarter,
    label: `Q${quarter} ${year}`,
    months,
    weeks,
  };
}

/**
 * Collects all weeks that overlap with or belong to the specified quarter.
 * Only includes weeks whose majority of days fall within the quarter months.
 * Follows ISO-8601 week definition (Monday start).
 *
 * @internal
 */
function collectWeeksForQuarter(
  quarterStart: Date,
  quarterEnd: Date,
  quarterMonths: number[],
): WeekInfo[] {
  const weeks: WeekInfo[] = [];

  const startCursor = startOfWeek(quarterStart);
  const endCursor = startOfWeek(quarterEnd);

  for (let cursor = startCursor; cursor.getTime() <= endCursor.getTime(); ) {
    const weekStart = new Date(cursor);
    const weekEnd = addDays(weekStart, 6);
    const majorityMonth = getMajorityMonth(weekStart);

    if (!quarterMonths.includes(majorityMonth)) {
      cursor = addDays(cursor, 7);
      continue;
    }

    weeks.push({
      start: weekStart,
      end: weekEnd,
      isoWeek: getISOWeekNumber(weekStart),
      month: majorityMonth,
    });

    cursor = addDays(cursor, 7);
  }

  return weeks;
}

/**
 * Parses an ISO-8601 date string (YYYY-MM-DD) into a Date object.
 * Handles missing components gracefully (defaults to month 1, day 1 if not provided).
 */
export function parseISODate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

/**
 * Formats a Date object into an ISO-8601 date string (YYYY-MM-DD).
 * Pads month and day with leading zeros to ensure consistent format.
 */
export function formatISODate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Returns the start of the week (Monday) for a given date.
 * Uses ISO-8601 week definition where Monday is the first day of the week.
 */
export function startOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = (day + 6) % 7;
  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Adds a specified number of days to a date.
 * Handles month and year boundaries automatically.
 */
export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_IN_DAY);
}

/**
 * Calculates the ISO-8601 week number for a given date.
 * ISO-8601 weeks start on Monday, and week 1 is the week containing the first Thursday of the year.
 * This means the first week may include days from the previous year.
 */
export function getISOWeekNumber(date: Date): number {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil(((target.getTime() - yearStart.getTime()) / MS_IN_DAY + 1) / 7);
}

/**
 * Checks if a week overlaps with a given date range.
 * A week overlaps if any part of it falls within the range (inclusive of boundaries).
 */
export function weekOverlapsRange(week: WeekInfo, start: Date, end: Date): boolean {
  return week.end.getTime() >= start.getTime() && week.start.getTime() <= end.getTime();
}

/**
 * Determines which month a week mostly belongs to.
 * Counts how many days of the week fall in each month and returns the month with the most days.
 * Used to assign weeks to months in the quarter structure.
 *
 * @internal
 */
function getMajorityMonth(weekStart: Date): number {
  const counts = new Map<number, number>();
  for (let i = 0; i < 7; i += 1) {
    const current = addDays(weekStart, i);
    const month = current.getMonth();
    counts.set(month, (counts.get(month) ?? 0) + 1);
  }

  let selectedMonth = weekStart.getMonth();
  let max = 0;
  counts.forEach((value, key) => {
    if (value > max) {
      max = value;
      selectedMonth = key;
    }
  });

  return selectedMonth;
}


