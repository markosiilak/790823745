import { useTranslations } from "@/lib/translations";
import { EmptyCell } from "@/components/QuarterPlanner/styles/quarterTableStyles";
import { TaskRow } from "@/components/QuarterPlanner/QuarterTable/TaskRow";
import type { WeekInfo } from "@/lib/quarter";
import type { ViewMode } from "@/components/QuarterPlanner/QuarterTable/constants";
import type { Task } from "@/components/QuarterPlanner/types";

type MonthWithWeeks = {
  month: number;
  weeks: WeekInfo[];
};

type ParsedTask = Task & {
  startDate: Date;
  endDate: Date;
};

type TableBodyProps = {
  parsedTasks: ParsedTask[];
  weeksToRender: WeekInfo[];
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

export function TableBody({
  parsedTasks,
  weeksToRender,
  monthsToRender,
  isCompact,
  onEditTask,
  onRemoveTask,
  onAddSubtask,
  onEditSubtask,
}: TableBodyProps) {
  const t = useTranslations("quarterTable");

  return (
    <tbody>
      {parsedTasks.length === 0 ? (
        <tr>
          <EmptyCell colSpan={3 + weeksToRender.length}>{t.noTasks}</EmptyCell>
        </tr>
      ) : (
        parsedTasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            monthsToRender={monthsToRender}
            isCompact={isCompact}
            onEditTask={onEditTask}
            onRemoveTask={onRemoveTask}
            onAddSubtask={onAddSubtask}
            onEditSubtask={onEditSubtask}
          />
        ))
      )}
    </tbody>
  );
}

