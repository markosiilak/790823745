import { QuarterStructure, formatISODate, parseISODate, weekOverlapsRange } from "@/lib/quarter";
import { Task } from "./types";
import {
  Card,
  TableHeader,
  Subtitle,
  TableWrapper,
  StyledTable,
  StickyHeaderCell,
  StickyBodyCell,
  TaskRow,
  TaskName,
  RemoveButton,
  WeekCell,
  EmptyCell,
  MonthHeaderCell,
  WeekHeaderCell,
  WeekRange,
} from "./styles/quarterTableStyles";
import { RemoveIcon } from "@/components/icons/RemoveIcon";
import { Tooltip } from "@/components/Tooltip";

const NAME_COLUMN_WIDTH = 260;
const DATE_COLUMN_WIDTH = 140;

type QuarterTableProps = {
  structure: QuarterStructure;
  tasks: Task[];
  onRemoveTask: (taskId: string) => void;
};

const weekFormatter = new Intl.DateTimeFormat("et-EE", {
  day: "2-digit",
  month: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat("et-EE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function QuarterTable({ structure, tasks, onRemoveTask }: QuarterTableProps) {
  const focusedMonthIndex = Math.floor(structure.months.length / 2);

  return (
    <Card>
      <TableHeader>
        <div>
          <h2>Quarter overview</h2>
          <Subtitle>
            Weeks follow ISO-8601 rules (Monday start, week 1 contains Thursday). Weeks are assigned
            to the month they mostly occupy.
          </Subtitle>
        </div>
      </TableHeader>
      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <StickyHeaderCell rowSpan={2} scope="col" $left={0} $width={NAME_COLUMN_WIDTH}>
                Task
              </StickyHeaderCell>
              <StickyHeaderCell
                rowSpan={2}
                scope="col"
                $left={NAME_COLUMN_WIDTH}
                $width={DATE_COLUMN_WIDTH}
              >
                Start date
              </StickyHeaderCell>
              <StickyHeaderCell
                rowSpan={2}
                scope="col"
                $left={NAME_COLUMN_WIDTH + DATE_COLUMN_WIDTH}
                $width={DATE_COLUMN_WIDTH}
              >
                End date
              </StickyHeaderCell>
              {structure.months.map((month, index) => (
                <MonthHeaderCell
                  key={month.month}
                  colSpan={month.weeks.length}
                  scope="colgroup"
                  $isFocused={index === focusedMonthIndex}
                >
                  {month.name}
                </MonthHeaderCell>
              ))}
            </tr>
            <tr>
              {structure.months.flatMap((month, index) =>
                month.weeks.map((week) => {
                  const weekStartKey = formatISODate(week.start);
                  const rangeLabel = `${weekFormatter.format(week.start)} – ${weekFormatter.format(week.end)}`;
                  return (
                    <Tooltip key={`${month.month}-${weekStartKey}`} content={rangeLabel}>
                      <WeekHeaderCell $isFocused={index === focusedMonthIndex}>
                        W{week.isoWeek}
                        <WeekRange>{rangeLabel}</WeekRange>
                      </WeekHeaderCell>
                    </Tooltip>
                  );
                }),
              )}
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <EmptyCell colSpan={3 + structure.weeks.length}>
                  No tasks yet. Add one above to see it highlighted here.
                </EmptyCell>
              </tr>
            ) : (
              tasks.map((task) => {
                const taskStart = parseISODate(task.start);
                const taskEnd = parseISODate(task.end);
                return (
                  <tr key={task.id}>
                    <StickyBodyCell as="th" scope="row" $left={0} $width={NAME_COLUMN_WIDTH}>
                      <TaskRow>
                        <TaskName>{task.name}</TaskName>
                        <RemoveButton
                          type="button"
                          onClick={() => onRemoveTask(task.id)}
                          aria-label={`Remove task ${task.name}`}
                        >
                          <RemoveIcon />
                        </RemoveButton>
                      </TaskRow>
                    </StickyBodyCell>
                    <StickyBodyCell
                      $left={NAME_COLUMN_WIDTH}
                      $width={DATE_COLUMN_WIDTH}
                    >
                      {dateFormatter.format(taskStart)}
                    </StickyBodyCell>
                    <StickyBodyCell
                      $left={NAME_COLUMN_WIDTH + DATE_COLUMN_WIDTH}
                      $width={DATE_COLUMN_WIDTH}
                    >
                      {dateFormatter.format(taskEnd)}
                    </StickyBodyCell>
                    {structure.months.flatMap((month, index) =>
                      month.weeks.map((week) => {
                        const weekStartKey = formatISODate(week.start);
                        const active = weekOverlapsRange(week, taskStart, taskEnd);
                        const rangeLabel = `${dateFormatter.format(week.start)} – ${dateFormatter.format(week.end)}`;
                        return (
                          <Tooltip key={`${task.id}-${weekStartKey}`} content={rangeLabel}>
                            <WeekCell $active={active} $dimmed={index !== focusedMonthIndex} />
                          </Tooltip>
                        );
                      }),
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </StyledTable>
      </TableWrapper>
    </Card>
  );
}


