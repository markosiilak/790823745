import { useState } from "react";
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
  ToggleButton,
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

const NAME_COLUMN_WIDTH = 260;
const DATE_COLUMN_WIDTH = 140;

type QuarterTableProps = {
  structure: QuarterStructure;
  tasks: Task[];
  onRemoveTask: (taskId: string) => void;
  onEditTask: (taskId: string) => void;
  onAddSubtask: (taskId: string, taskName: string, week: WeekInfo) => void;
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
}: QuarterTableProps) {
  const [isCompact, setIsCompact] = useState(false);

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
          <ToggleButton
            type="button"
            onClick={() => setIsCompact((previous) => !previous)}
            $active={isCompact}
            aria-pressed={isCompact}
          >
            {isCompact ? "Standard width" : "Compact width"}
          </ToggleButton>
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
              {structure.months.map((month) => (
                <th key={month.month} colSpan={month.weeks.length} scope="colgroup">
                  {month.name}
                </th>
              ))}
            </tr>
            <tr>
              {structure.months.flatMap((month) =>
                month.weeks.map((week) => {
                  const weekStartKey = formatISODate(week.start);
                  const rangeLabel = `${weekFormatter.format(week.start)} – ${weekFormatter.format(week.end)}`;
                  return (
                    <Tooltip key={`${month.month}-${weekStartKey}`} content={rangeLabel}>
                      <th>
                        W{week.isoWeek}
                      </th>
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
                    {structure.months.flatMap((month) =>
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

                        return (
                          <Tooltip key={`${task.id}-${weekStartKey}`} content={rangeLabel}>
                            <WeekCell $active={active} $compact={isCompact}>
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
                                <EmptySubtasks>No subtasks</EmptySubtasks>
                              ) : null}
                            </WeekCell>
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


