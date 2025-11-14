'use client';

import { useMemo, useCallback } from "react";
import { QuarterKey, WeekInfo } from "@/lib/quarter";
import { buildQuarterStructure } from "@/lib/quarter";
import { HeaderSection } from "./HeaderSection";
import { QuarterTable } from "./QuarterTable/index";
import { SubtaskDialog } from "./Subtasks/SubtaskDialog";
import { PlannerShell, AddTaskButton } from "./styles/quarterPlannerStyles";
import { useTranslations } from "@/lib/translations";
import { useTasks } from "./hooks/useTasks";
import { useSubtasks } from "./hooks/useSubtasks";
import { useQuarterNavigation } from "./hooks/useQuarterNavigation";
import { Subtask } from "./types";

type QuarterPlannerProps = {
  initialQuarter: QuarterKey;
};

export function QuarterPlanner({ initialQuarter }: QuarterPlannerProps) {
  const t = useTranslations("quarterPlanner");
  
  const { currentQuarter, handleShiftQuarter, navigateToEditTask, navigateToAddTask } =
    useQuarterNavigation(initialQuarter);
  
  const { tasks, removeTask, updateTaskSubtasks } = useTasks();

  const handleSubtaskCreated = useCallback(
    (taskId: string, subtask: Subtask) => {
      updateTaskSubtasks(taskId, (subtasks) => [...subtasks, subtask]);
    },
    [updateTaskSubtasks],
  );

  const handleSubtaskUpdated = useCallback(
    (taskId: string, subtaskId: string, subtask: Subtask) => {
      updateTaskSubtasks(taskId, (subtasks) =>
        subtasks.map((s) => (s.id === subtaskId ? subtask : s)),
      );
    },
    [updateTaskSubtasks],
  );

  const {
    subtaskDraft,
    subtaskError,
    isSavingSubtask,
    handleAddSubtask,
    handleAddSubtaskForWeek,
    handleEditSubtask,
    handleSubtaskSubmit,
    closeSubtaskDialog,
  } = useSubtasks({
    onSubtaskCreated: handleSubtaskCreated,
    onSubtaskUpdated: handleSubtaskUpdated,
  });

  const structure = useMemo(
    () => buildQuarterStructure(currentQuarter.year, currentQuarter.quarter),
    [currentQuarter.year, currentQuarter.quarter],
  );

  const handleSubtaskAddForWeekWithTasks = useCallback(
    (week: WeekInfo, candidateTaskIds: string[]) => {
      const taskOptions = tasks
        .filter((task) => candidateTaskIds.includes(task.id))
        .map((task) => ({
          id: task.id,
          name: task.name,
        }));
      handleAddSubtaskForWeek(week, taskOptions);
    },
    [tasks, handleAddSubtaskForWeek],
  );

  return (
    <PlannerShell>
      <HeaderSection
        label={structure.label}
        subtitle={t.subtitle}
        onPrevious={() => handleShiftQuarter(-1)}
        onNext={() => handleShiftQuarter(1)}
        extraActions={
          <AddTaskButton type="button" onClick={navigateToAddTask}>
            {t.addTask}
          </AddTaskButton>
        }
      />

      <QuarterTable
        structure={structure}
        tasks={tasks}
        onRemoveTask={removeTask}
        onEditTask={navigateToEditTask}
        onAddSubtask={handleAddSubtask}
        onAddSubtaskForWeek={handleSubtaskAddForWeekWithTasks}
        onEditSubtask={handleEditSubtask}
      />
      {subtaskDraft ? (
        <SubtaskDialog
          key={
            subtaskDraft.mode === "task"
              ? `task-${subtaskDraft.taskId}-${subtaskDraft.week.start.toISOString()}-${subtaskDraft.subtaskId || "new"}`
              : `week-${subtaskDraft.week.start.toISOString()}`
          }
          mode={subtaskDraft.mode}
          taskName={subtaskDraft.mode === "task" ? subtaskDraft.taskName : undefined}
          taskId={subtaskDraft.mode === "task" ? subtaskDraft.taskId : undefined}
          week={subtaskDraft.week}
          availableTasks={subtaskDraft.mode === "week" ? subtaskDraft.taskOptions : []}
          error={subtaskError}
          isSaving={isSavingSubtask}
          subtaskId={subtaskDraft.mode === "task" ? subtaskDraft.subtaskId : undefined}
          initialTitle={subtaskDraft.mode === "task" ? subtaskDraft.initialTitle : undefined}
          initialDate={subtaskDraft.mode === "task" ? subtaskDraft.initialTimestamp : undefined}
          onDismiss={closeSubtaskDialog}
          onSubmit={({ taskId, title, date, time, subtaskId }) =>
            handleSubtaskSubmit(taskId, { title, date, time, subtaskId })
          }
        />
      ) : null}
    </PlannerShell>
  );
}


