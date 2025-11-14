import { formatISODate, weekOverlapsRange } from "@/lib/quarter";
import { useTranslations } from "@/lib/translations";
import { Tooltip } from "@/components/Tooltip";
import {
  WeekCell as StyledWeekCell,
  AddSubtaskButton,
  SubtaskList,
  SubtaskItem,
  SubtaskTitle,
  EmptySubtasks,
} from "@/components/QuarterPlanner/styles/quarterTableStyles";
import { dateFormatter } from "@/components/QuarterPlanner/QuarterTable/constants";
import type { WeekInfo } from "@/lib/quarter";
import type { Subtask } from "@/components/QuarterPlanner/types";

type WeekCellProps = {
  week: WeekInfo;
  taskId: string;
  taskName: string;
  isCompact: boolean;
  weekSubtasks: Array<Subtask & { timestampDate: Date }>;
  active: boolean;
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

/**
 * Renders a single week cell in the task table.
 * Displays subtasks for the week and provides UI for adding/editing subtasks.
 * Shows an "Add subtask" button if the week is active (overlaps with task range).
 * Makes subtasks clickable for editing. Handles empty state rendering.
 */
export function WeekCell({
  week,
  taskId,
  taskName,
  isCompact,
  weekSubtasks,
  active,
  onAddSubtask,
  onEditSubtask,
}: WeekCellProps) {
  const t = useTranslations("quarterTable");
  const weekStartKey = formatISODate(week.start);
  const rangeLabel = `${dateFormatter.format(week.start)} – ${dateFormatter.format(week.end)}`;
  const hasContent = active || weekSubtasks.length > 0;

  if (!hasContent) {
    return (
      <StyledWeekCell
        key={`${taskId}-${weekStartKey}`}
        $active={false}
        $compact={isCompact}
        $hasContent={false}
        aria-hidden="true"
      />
    );
  }

  return (
    <Tooltip key={`${taskId}-${weekStartKey}`} content={rangeLabel}>
      <StyledWeekCell $active={active} $compact={isCompact} $hasContent>
        <AddSubtaskButton
          type="button"
          onClick={() => onAddSubtask(taskId, taskName, week)}
          aria-label={`${t.addSubtaskForTask} ${taskName} ${t.addSubtaskInWeek} ${week.isoWeek}`}
        >
          +
        </AddSubtaskButton>
        {weekSubtasks.length > 0 ? (
          <SubtaskList>
            {weekSubtasks.map((subtask) => (
              <SubtaskItem
                key={subtask.id}
                onClick={() =>
                  onEditSubtask(taskId, taskName, subtask.id, subtask.title, subtask.timestamp, week)
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onEditSubtask(taskId, taskName, subtask.id, subtask.title, subtask.timestamp, week);
                  }
                }}
                aria-label={`${t.editSubtask}: ${subtask.title}`}
              >
                <SubtaskTitle>{subtask.title}</SubtaskTitle>
              </SubtaskItem>
            ))}
          </SubtaskList>
        ) : active ? (
          <EmptySubtasks></EmptySubtasks>
        ) : null}
      </StyledWeekCell>
    </Tooltip>
  );
}

