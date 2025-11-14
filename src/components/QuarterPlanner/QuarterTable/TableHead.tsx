import { formatISODate } from "@/lib/quarter";
import { useTranslations } from "@/lib/translations";
import { Tooltip } from "@/components/Tooltip";
import {
  StickyHeaderCell,
  WeekHeaderContent,
  WeekHeaderLabel,
  AddWeekButton,
} from "@/components/QuarterPlanner/styles/quarterTableStyles";
import { NAME_COLUMN_WIDTH, DATE_COLUMN_WIDTH, weekFormatter } from "@/components/QuarterPlanner/QuarterTable/constants";
import { weekOverlapsRange } from "@/lib/quarter";
import type { QuarterStructure, WeekInfo } from "@/lib/quarter";
import type { ViewMode } from "@/components/QuarterPlanner/QuarterTable/constants";

type MonthWithWeeks = {
  month: number;
  name: string;
  weeks: WeekInfo[];
};

type TableHeadProps = {
  monthsToRender: MonthWithWeeks[];
  isCompact: boolean;
  parsedTasks: Array<{ id: string; startDate: Date; endDate: Date }>;
  onAddSubtaskForWeek?: (week: WeekInfo, candidateTaskIds: string[]) => void;
};

export function TableHead({ monthsToRender, isCompact, parsedTasks, onAddSubtaskForWeek }: TableHeadProps) {
  const t = useTranslations("quarterTable");

  return (
    <thead>
      <tr>
        <StickyHeaderCell
          rowSpan={2}
          scope="col"
          $left={0}
          $width={NAME_COLUMN_WIDTH}
          $compact={isCompact}
        >
          {t.taskColumn}
        </StickyHeaderCell>
        <StickyHeaderCell
          rowSpan={2}
          scope="col"
          $left={NAME_COLUMN_WIDTH}
          $width={DATE_COLUMN_WIDTH}
          $compact={isCompact}
        >
          {t.startDateColumn}
        </StickyHeaderCell>
        <StickyHeaderCell
          rowSpan={2}
          scope="col"
          $left={NAME_COLUMN_WIDTH + DATE_COLUMN_WIDTH}
          $width={DATE_COLUMN_WIDTH}
          $compact={isCompact}
        >
          {t.endDateColumn}
        </StickyHeaderCell>
        {monthsToRender.map((month) => (
          <th key={month.month} colSpan={month.weeks.length} scope="colgroup">
            {month.name}
          </th>
        ))}
      </tr>
      <tr>
        {monthsToRender.flatMap((month) =>
          month.weeks.map((week) => {
            const weekStartKey = formatISODate(week.start);
            const rangeLabel = `${weekFormatter.format(week.start)} – ${weekFormatter.format(week.end)}`;
            const weekTasks = parsedTasks.filter((task) =>
              weekOverlapsRange(week, task.startDate, task.endDate),
            );
            const canAddForWeek = weekTasks.length > 0;
            return (
              <Tooltip key={`${month.month}-${weekStartKey}`} content={rangeLabel}>
                <th>
                  <WeekHeaderContent>
                    <WeekHeaderLabel>{`W${week.isoWeek}`}</WeekHeaderLabel>
                    {canAddForWeek ? (
                      <AddWeekButton
                        type="button"
                        aria-label={`${t.addSubtaskInWeek} ${week.isoWeek}`}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          onAddSubtaskForWeek?.(
                            week,
                            weekTasks.map((task) => task.id),
                          );
                        }}
                      >
                        +
                      </AddWeekButton>
                    ) : null}
                  </WeekHeaderContent>
                </th>
              </Tooltip>
            );
          }),
        )}
      </tr>
    </thead>
  );
}

