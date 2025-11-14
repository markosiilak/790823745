import { formatISODate, weekOverlapsRange } from "@/lib/quarter";
import { useTranslations } from "@/lib/translations";
import {
  StickyBodyCell,
  TaskRow as StyledTaskRow,
  TaskName,
  ActionGroup,
  EditButton,
  RemoveButton,
} from "@/components/QuarterPlanner/styles/quarterTableStyles";
import { EditIcon } from "@/components/icons/EditIcon";
import { RemoveIcon } from "@/components/icons/RemoveIcon";
import { NAME_COLUMN_WIDTH, DATE_COLUMN_WIDTH, dateFormatter } from "@/components/QuarterPlanner/QuarterTable/constants";
import { WeekCell } from "@/components/QuarterPlanner/QuarterTable/WeekCell";
import type { WeekInfo } from "@/lib/quarter";
import type { Task, Subtask } from "@/components/QuarterPlanner/types";

type MonthWithWeeks = {
  month: number;
  weeks: WeekInfo[];
};

type TaskRowProps = {
  task: Task & { startDate: Date; endDate: Date };
  monthsToRender: MonthWithWeeks[];
  isCompact: boolean;
  onEditTask: (taskId: string) => void;
  onRemoveTask: (taskId: string) => void;
  onAddSubtask: (taskId: string, taskName: string, week: WeekInfo) => void;
  onEditSubtask: (
    taskId: string,
    taskName: string,
    subtaskId: string,
    subtaskTitle: string,
    subtaskTimestamp: string,
    week: WeekInfo,
  ) => void;
};

/** * Displays task name, start/end dates, edit/remove buttons, and week cells with subtasks. *
 */
export function TaskRow({
  task,
  monthsToRender,
  isCompact,
  onEditTask,
  onRemoveTask,
  onAddSubtask,
  onEditSubtask,
}: TaskRowProps) {
  const t = useTranslations("quarterTable");
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
        <StyledTaskRow>
          <TaskName>{task.name}</TaskName>
          <ActionGroup>
            <EditButton
              type="button"
              onClick={() => onEditTask(task.id)}
              aria-label={`${t.editTask} ${task.name}`}
            >
              <EditIcon />
            </EditButton>
            <RemoveButton
              type="button"
              onClick={() => onRemoveTask(task.id)}
              aria-label={`${t.removeTask} ${task.name}`}
            >
              <RemoveIcon />
            </RemoveButton>
          </ActionGroup>
        </StyledTaskRow>
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

          const weekStartMs = week.start.getTime();
          const weekEndMs = week.end.getTime() + 24 * 60 * 60 * 1000 - 1;

          const weekSubtasks = task.subtasks
            .map((subtask: { id: string; title: string; timestamp: string }) => {
              const timestampDate = new Date(subtask.timestamp);
              return {
                ...subtask,
                timestampDate,
              };
            })
            .filter((subtask: { timestampDate: Date }) => {
              const time = subtask.timestampDate.getTime();
              return !Number.isNaN(time) && time >= weekStartMs && time <= weekEndMs;
            })
            .sort((a: { timestampDate: Date }, b: { timestampDate: Date }) =>
              a.timestampDate.getTime() - b.timestampDate.getTime(),
            );

          return (
            <WeekCell
              key={`${task.id}-${weekStartKey}`}
              week={week}
              taskId={task.id}
              taskName={task.name}
              isCompact={isCompact}
              weekSubtasks={weekSubtasks}
              active={active}
              onAddSubtask={onAddSubtask}
              onEditSubtask={onEditSubtask}
            />
          );
        }),
      )}
    </tr>
  );
}

