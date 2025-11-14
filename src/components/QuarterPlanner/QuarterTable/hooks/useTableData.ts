import { useMemo } from "react";
import { QuarterStructure, WeekInfo, parseISODate, weekOverlapsRange } from "@/lib/quarter";
import { Task } from "@/components/QuarterPlanner/types";
import { useLocale } from "@/lib/translations";
import type { ViewMode } from "@/components/QuarterPlanner/QuarterTable/constants";

type ParsedTask = Task & {
  startDate: Date;
  endDate: Date;
};

/**
 * Parses task dates, determines which weeks are active (have tasks), and filters data based on view mode.
 *   - parsedTasks: Array of parsed tasks with start and end dates
 *   - activeWeekKeys: Array of ISO date strings for weeks that have active tasks
 *   - weeksToRender: Array of weeks to render based on view mode
 *   - monthsToRender: Array of months to render based on view mode
 */
export function useTableData(
  tasks: Task[],
  structure: QuarterStructure,
  viewMode: ViewMode,
  effectiveSelectedWeekKey: string | null,
) {
  const [currentLocale] = useLocale();

  const parsedTasks = useMemo<ParsedTask[]>(
    () =>
      tasks.map((task) => ({
        ...task,
        startDate: parseISODate(task.start),
        endDate: parseISODate(task.end),
      })),
    [tasks],
  );

  const activeWeekKeys = useMemo(
    () =>
      structure.weeks
        .filter((week) =>
          parsedTasks.some((task) => weekOverlapsRange(week, task.startDate, task.endDate)),
        )
        .map((week) => week.start.toISOString()),
    [parsedTasks, structure.weeks],
  );

  const weeksToRender = useMemo(() => {
    if (viewMode === "single-week") {
      if (!effectiveSelectedWeekKey) {
        return [];
      }
      return structure.weeks.filter((week) => week.start.toISOString() === effectiveSelectedWeekKey);
    }
    return structure.weeks;
  }, [effectiveSelectedWeekKey, structure.weeks, viewMode]);

  const monthsToRender = useMemo(() => {
    const localeCode = currentLocale === "et" ? "et-EE" : "en-US";
    const monthFormatter = new Intl.DateTimeFormat(localeCode, { month: "long" });

    const baseMonths =
      viewMode === "single-week"
        ? structure.months
            .map((month) => ({
              ...month,
              weeks: month.weeks.filter((week) =>
                weeksToRender.some((visibleWeek) => visibleWeek.start.getTime() === week.start.getTime()),
              ),
            }))
            .filter((month) => month.weeks.length > 0)
        : structure.months;

    // Format month names based on current locale
    return baseMonths.map((month) => ({
      ...month,
      name: monthFormatter.format(new Date(structure.year, month.month, 1)),
    }));
  }, [currentLocale, structure.months, structure.year, viewMode, weeksToRender]);

  return {
    parsedTasks,
    activeWeekKeys,
    weeksToRender,
    monthsToRender,
  };
}

