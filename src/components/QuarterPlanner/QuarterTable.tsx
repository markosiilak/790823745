import { useMemo, useState } from "react";
import { QuarterStructure, WeekInfo, formatISODate, parseISODate, weekOverlapsRange } from "@/lib/quarter";
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
  ActionGroup,
  EditButton,
  RemoveButton,
  WeekCell,
  EmptyCell,
  TableActions,
  ViewControls,
  WeekHeaderContent,
  WeekHeaderLabel,
  AddWeekButton,
  AddSubtaskButton,
  SubtaskList,
  SubtaskItem,
  SubtaskMeta,
  SubtaskTitle,
  EmptySubtasks,
} from "./styles/quarterTableStyles";
import { RemoveIcon } from "@/components/icons/RemoveIcon";
import { EditIcon } from "@/components/icons/EditIcon";
import { Tooltip } from "@/components/Tooltip";
import { Dropdown, DropdownOption } from "./Dropdown";

const NAME_COLUMN_WIDTH = 260;
const DATE_COLUMN_WIDTH = 140;

type QuarterTableProps = {
  structure: QuarterStructure;
  tasks: Task[];
  onRemoveTask: (taskId: string) => void;
  onEditTask: (taskId: string) => void;
  onAddSubtask: (taskId: string, taskName: string, week: WeekInfo) => void;
  onAddSubtaskForWeek: (week: WeekInfo, candidateTaskIds: string[]) => void;
};

type ViewMode = "standard" | "compact" | "single-week";

const weekFormatter = new Intl.DateTimeFormat("et-EE", {
  day: "2-digit",
  month: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat("et-EE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const subtaskDateFormatter = new Intl.DateTimeFormat("et-EE", {
  day: "2-digit",
  month: "2-digit",
});

const subtaskTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});

export function QuarterTable({
  structure,
  tasks,
  onRemoveTask,
  onEditTask,
  onAddSubtask,
  onAddSubtaskForWeek,
}: QuarterTableProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("standard");
  const [selectedWeekKey, setSelectedWeekKey] = useState<string | null>(() => {
    const firstWeek = structure.weeks[0];
    return firstWeek ? firstWeek.start.toISOString() : null;
  });

  const parsedTasks = useMemo(
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

  const firstActiveWeekKey = useMemo(() => {
    if (activeWeekKeys.length > 0) {
      return activeWeekKeys[0];
    }
    return structure.weeks[0]?.start.toISOString() ?? null;
  }, [activeWeekKeys, structure.weeks]);

  const effectiveSelectedWeekKey = useMemo(() => {
    if (structure.weeks.length === 0) {
      return null;
    }
    if (!selectedWeekKey) {
      return firstActiveWeekKey;
    }
    const exists = structure.weeks.some((week) => week.start.toISOString() === selectedWeekKey);
    return exists ? selectedWeekKey : firstActiveWeekKey;
  }, [firstActiveWeekKey, selectedWeekKey, structure.weeks]);

  const isCompact = viewMode === "compact";

  const viewModeOptions = useMemo<DropdownOption[]>(
    () => [
      { value: "standard", label: "Full quarter · standard" },
      { value: "compact", label: "Full quarter · compact" },
      { value: "single-week", label: "Single week" },
    ],
    [],
  );

  const weekDropdownOptions = useMemo<DropdownOption[]>(
    () =>
      structure.weeks.map((week) => ({
        value: week.start.toISOString(),
        label: `W${week.isoWeek} · ${weekFormatter.format(week.start)} – ${weekFormatter.format(week.end)}`,
        disabled: activeWeekKeys.length > 0 && !activeWeekKeys.includes(week.start.toISOString()),
      })),
    [activeWeekKeys, structure.weeks],
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

  const monthsToRender = useMemo(
    () =>
      viewMode === "single-week"
        ? structure.months
            .map((month) => ({
              ...month,
              weeks: month.weeks.filter((week) =>
                weeksToRender.some((visibleWeek) => visibleWeek.start.getTime() === week.start.getTime()),
              ),
            }))
            .filter((month) => month.weeks.length > 0)
        : structure.months,
    [structure.months, viewMode, weeksToRender],
  );

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
        <TableActions>
          <ViewControls>
            <Dropdown
              options={viewModeOptions}
              value={viewMode}
              onChange={(nextValue) => {
                const nextMode = nextValue as ViewMode;
                setViewMode(nextMode);
                if (nextMode !== "single-week") {
                  return;
                }
                setSelectedWeekKey((current) => {
                  if (
                    current &&
                    structure.weeks.some((week) => week.start.toISOString() === current) &&
                    (activeWeekKeys.length === 0 || activeWeekKeys.includes(current))
                  ) {
                    return current;
                  }
                  return firstActiveWeekKey;
                });
              }}
              ariaLabel="Table view mode"
              width="220px"
            />
            {viewMode === "single-week" ? (
              <Dropdown
                options={weekDropdownOptions}
                value={effectiveSelectedWeekKey}
                onChange={(nextValue) => setSelectedWeekKey(nextValue)}
                ariaLabel="Select week to display"
                width="260px"
                disabled={weekDropdownOptions.length === 0}
                placeholder="No weeks"
              />
            ) : null}
          </ViewControls>
        </TableActions>
      </TableHeader>
      <TableWrapper>
        <StyledTable $compact={isCompact}>
          <thead>
            <tr>
              <StickyHeaderCell
                rowSpan={2}
                scope="col"
                $left={0}
                $width={NAME_COLUMN_WIDTH}
                $compact={isCompact}
              >
                Task
              </StickyHeaderCell>
              <StickyHeaderCell
                rowSpan={2}
                scope="col"
                $left={NAME_COLUMN_WIDTH}
                $width={DATE_COLUMN_WIDTH}
                $compact={isCompact}
              >
                Start date
              </StickyHeaderCell>
              <StickyHeaderCell
                rowSpan={2}
                scope="col"
                $left={NAME_COLUMN_WIDTH + DATE_COLUMN_WIDTH}
                $width={DATE_COLUMN_WIDTH}
                $compact={isCompact}
              >
                End date
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
                        </WeekHeaderContent>
                      </th>
                    </Tooltip>
                  );
                }),
              )}
            </tr>
          </thead>
          <tbody>
            {parsedTasks.length === 0 ? (
              <tr>
                <EmptyCell colSpan={3 + weeksToRender.length}>
                  No tasks yet. Add one above to see it highlighted here.
                </EmptyCell>
              </tr>
            ) : (
              parsedTasks.map((task) => {
                const taskStart = task.startDate;
                const taskEnd = task.endDate;
                return (
                  <tr key={task.id}>
                    <StickyBodyCell
                      as="th"
                      scope="row"
                      $left={0}
                      $width={NAME_COLUMN_WIDTH}
                      $compact={isCompact}
                    >
                      <TaskRow>
                        <TaskName>{task.name}</TaskName>
                        <ActionGroup>
                          <EditButton
                            type="button"
                            onClick={() => onEditTask(task.id)}
                            aria-label={`Edit task ${task.name}`}
                          >
                            <EditIcon />
                          </EditButton>
                          <RemoveButton
                            type="button"
                            onClick={() => onRemoveTask(task.id)}
                            aria-label={`Remove task ${task.name}`}
                          >
                            <RemoveIcon />
                          </RemoveButton>
                        </ActionGroup>
                      </TaskRow>
                    </StickyBodyCell>
                    <StickyBodyCell
                      $left={NAME_COLUMN_WIDTH}
                      $width={DATE_COLUMN_WIDTH}
                      $compact={isCompact}
                    >
                      {dateFormatter.format(taskStart)}
                    </StickyBodyCell>
                    <StickyBodyCell
                      $left={NAME_COLUMN_WIDTH + DATE_COLUMN_WIDTH}
                      $width={DATE_COLUMN_WIDTH}
                      $compact={isCompact}
                    >
                      {dateFormatter.format(taskEnd)}
                    </StickyBodyCell>
                    {monthsToRender.flatMap((month) =>
                      month.weeks.map((week) => {
                        const weekStartKey = formatISODate(week.start);
                        const active = weekOverlapsRange(week, taskStart, taskEnd);
                        const rangeLabel = `${dateFormatter.format(week.start)} – ${dateFormatter.format(
                          week.end,
                        )}`;

                        const weekStartMs = week.start.getTime();
                        const weekEndMs = week.end.getTime() + 24 * 60 * 60 * 1000 - 1;

                        const weekSubtasks = task.subtasks
                          .map((subtask) => {
                            const timestampDate = new Date(subtask.timestamp);
                            return {
                              ...subtask,
                              timestampDate,
                            };
                          })
                          .filter((subtask) => {
                            const time = subtask.timestampDate.getTime();
                            return !Number.isNaN(time) && time >= weekStartMs && time <= weekEndMs;
                          })
                          .sort(
                            (a, b) =>
                              a.timestampDate.getTime() - b.timestampDate.getTime(),
                          );

                        const hasContent = active || weekSubtasks.length > 0;

                        return hasContent ? (
                          <Tooltip key={`${task.id}-${weekStartKey}`} content={rangeLabel}>
                            <WeekCell $active={active} $compact={isCompact} $hasContent>
                              <AddSubtaskButton
                                type="button"
                                onClick={() => onAddSubtask(task.id, task.name, week)}
                                aria-label={`Add subtask for ${task.name} in week ${week.isoWeek}`}
                              >
                                +
                              </AddSubtaskButton>
                              {weekSubtasks.length > 0 ? (
                                <SubtaskList>
                                  {weekSubtasks.map((subtask) => (
                                    <SubtaskItem key={subtask.id}>
                                      <SubtaskMeta>
                                        {subtaskDateFormatter.format(subtask.timestampDate)} ·{" "}
                                        {subtaskTimeFormatter.format(subtask.timestampDate)}
                                      </SubtaskMeta>
                                      <SubtaskTitle>{subtask.title}</SubtaskTitle>
                                    </SubtaskItem>
                                  ))}
                                </SubtaskList>
                              ) : active ? (
                                <EmptySubtasks></EmptySubtasks>
                              ) : null}
                            </WeekCell>
                          </Tooltip>
                        ) : (
                          <WeekCell
                            key={`${task.id}-${weekStartKey}`}
                            $active={false}
                            $compact={isCompact}
                            $hasContent={false}
                            aria-hidden="true"
                          />
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


