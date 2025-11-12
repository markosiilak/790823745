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

export function getQuarterFromDate(date: Date): QuarterKey {
  const month = date.getMonth();
  return { year: date.getFullYear(), quarter: Math.floor(month / 3) + 1 };
}

export function shiftQuarter(current: QuarterKey, delta: number): QuarterKey {
  const total = current.year * 4 + current.quarter - 1 + delta;
  const year = Math.floor(total / 4);
  const quarter = (total % 4) + 1;
  return { year, quarter };
}

export function buildQuarterStructure(year: number, quarter: number): QuarterStructure {
  const quarterIndex = quarter - 1;
  const firstMonth = quarterIndex * 3;
  const months = [firstMonth, firstMonth + 1, firstMonth + 2];

  const start = new Date(year, firstMonth, 1);
  const end = new Date(year, firstMonth + 3, 0);

  const weeks = collectWeeks(start, end, months);

  return {
    year,
    quarter,
    label: `Q${quarter} ${year}`,
    months: months.map((month) => ({
      month,
      name: monthFormatter.format(new Date(year, month, 1)),
      weeks: weeks.filter((week) => week.month === month),
    })),
    weeks,
  };
}

export function weekOverlapsRange(week: WeekInfo, start: Date, end: Date): boolean {
  return week.end.getTime() >= start.getTime() && week.start.getTime() <= end.getTime();
}

export function parseISODate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function formatISODate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function startOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = (day + 6) % 7;
  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_IN_DAY);
}

export function getISOWeekNumber(date: Date): number {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil(((target.getTime() - yearStart.getTime()) / MS_IN_DAY + 1) / 7);
}

function collectWeeks(start: Date, end: Date, months: number[]): WeekInfo[] {
  const weeks: WeekInfo[] = [];
  let cursor = startOfWeek(start);
  const endCursor = startOfWeek(end);

  while (cursor.getTime() <= endCursor.getTime()) {
    const weekStart = new Date(cursor);
    const weekEnd = addDays(weekStart, 6);
    const majorityMonth = getMajorityMonth(weekStart);

    if (months.includes(majorityMonth)) {
      weeks.push({
        start: weekStart,
        end: weekEnd,
        isoWeek: getISOWeekNumber(weekStart),
        month: majorityMonth,
      });
    }

    cursor = addDays(cursor, 7);
  }

  return weeks;
}

function getMajorityMonth(weekStart: Date): number {
  const counts = new Map<number, number>();
  for (let i = 0; i < 7; i += 1) {
    const current = addDays(weekStart, i);
    const month = current.getMonth();
    counts.set(month, (counts.get(month) ?? 0) + 1);
  }

  let selected = weekStart.getMonth();
  let max = 0;

  counts.forEach((value, key) => {
    if (value > max) {
      selected = key;
      max = value;
    }
  });

  return selected;
}
const MS_IN_DAY = 24 * 60 * 60 * 1000;

export type QuarterKey = {
  year: number;
  quarter: number;
};

export type WeekInfo = {
  start: Date;
  end: Date;
  isoWeek: number;
  month: number; // 0-indexed
};

export type MonthInfo = {
  month: number; // 0-indexed
  name: string;
  weeks: WeekInfo[];
};

export type QuarterStructure = QuarterKey & {
  label: string;
  months: MonthInfo[];
  weeks: WeekInfo[];
};

const monthFormatter = new Intl.DateTimeFormat("en", { month: "long" });

export function getQuarterFromDate(date: Date): QuarterKey {
  const month = date.getMonth(); // 0-indexed
  const quarter = Math.floor(month / 3) + 1;
  return { year: date.getFullYear(), quarter };
}

export function shiftQuarter({ year, quarter }: QuarterKey, delta: number): QuarterKey {
  const totalQuarters = year * 4 + (quarter - 1) + delta;
  const nextYear = Math.floor(totalQuarters / 4);
  const nextQuarter = (totalQuarters % 4) + 1;
  return { year: nextYear, quarter: nextQuarter };
}

export function buildQuarterStructure(year: number, quarter: number): QuarterStructure {
  const quarterIndex = quarter - 1;
  const firstMonth = quarterIndex * 3;
  const quarterMonths = [firstMonth, firstMonth + 1, firstMonth + 2];

  const quarterStart = new Date(year, firstMonth, 1);
  const quarterEnd = new Date(year, firstMonth + 3, 0); // last day of the quarter

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

export function parseISODate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function formatISODate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function startOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = (day + 6) % 7; // Monday as first day
  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_IN_DAY);
}

export function getISOWeekNumber(date: Date): number {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil(((target.getTime() - yearStart.getTime()) / MS_IN_DAY + 1) / 7);
}

export function weekOverlapsRange(week: WeekInfo, start: Date, end: Date): boolean {
  return week.end.getTime() >= start.getTime() && week.start.getTime() <= end.getTime();
}

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


