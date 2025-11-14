'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  QuarterKey,
  WeekInfo,
  buildQuarterStructure,
  shiftQuarter,
} from "@/lib/quarter";
import { HeaderSection } from "./HeaderSection";
import { QuarterTable } from "./QuarterTable";
import { Task, Subtask } from "./types";
import { SubtaskDialog } from "./Subtasks/SubtaskDialog";
import { normalizeTasks } from "@/lib/task-utils";
import { PlannerShell, AddTaskButton } from "./styles/quarterPlannerStyles";

const plannerSubtitle =
  "Visualise task timelines across weeks. Navigate between quarters and add up to ten tasks to your view.";

type StoredSubtask = {
  id?: string;
  title?: string;
  timestamp?: string;
};

type StoredTask = {
  id?: string;
  name?: string;
  start?: string;
  end?: string;
  durationDays?: number;
  subtasks?: StoredSubtask[];
};

type QuarterPlannerProps = {
  initialQuarter: QuarterKey;
};

export function QuarterPlanner({ initialQuarter }: QuarterPlannerProps) {
  const router = useRouter();

  const [currentQuarter, setCurrentQuarter] = useState<QuarterKey>(initialQuarter);
  const [tasks, setTasks] = useState<Task[]>([]);
type SubtaskDraft =
  | {
      mode: "task";
      taskId: string;
      taskName: string;
      week: WeekInfo;
      subtaskId?: string;
      initialTitle?: string;
      initialTimestamp?: string;
    }
  | {
      mode: "week";
      week: WeekInfo;
      taskOptions: Array<{ id: string; name: string }>;
    };

  const [subtaskDraft, setSubtaskDraft] = useState<SubtaskDraft | null>(null);
  const [subtaskError, setSubtaskError] = useState<string | null>(null);
  const [isSavingSubtask, setIsSavingSubtask] = useState(false);

  useEffect(() => {
    setCurrentQuarter(initialQuarter);
  }, [initialQuarter]);

  useEffect(() => {
    let cancelled = false;

    async function loadTasks() {
      try {
        const response = await fetch("/api/tasks", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const payload = (await response.json()) as StoredTask[];
        if (!cancelled) {
          setTasks(normalizeTasks(payload));
        }
      } catch (error) {
        console.error("Failed to load tasks", error);
        if (!cancelled) {
          setTasks([]);
        }
      }
    }

    loadTasks();
    return () => {
      cancelled = true;
    };
  }, []);

  const structure = useMemo(
    () => buildQuarterStructure(currentQuarter.year, currentQuarter.quarter),
    [currentQuarter.year, currentQuarter.quarter],
  );

  const handleShiftQuarter = useCallback(
    (delta: number) => {
      const nextQuarter = shiftQuarter(currentQuarter, delta);
      setCurrentQuarter(nextQuarter);
      router.push(`/calendar/${nextQuarter.year}/${nextQuarter.quarter}`);
    },
    [currentQuarter, router],
  );

  const handleRemoveTask = useCallback((taskId: string) => {
    setTasks((previous) => previous.filter((task) => task.id !== taskId));
  }, []);

  const handleSubtaskAddRequest = useCallback(
    (taskId: string, taskName: string, week: WeekInfo) => {
      setSubtaskDraft({
        mode: "task",
        taskId,
        taskName,
        week,
      });
      setSubtaskError(null);
    },
    [],
  );

  const handleSubtaskAddForWeek = useCallback(
    (week: WeekInfo, candidateTaskIds: string[]) => {
      const taskOptions = tasks
        .filter((task) => candidateTaskIds.includes(task.id))
        .map((task) => ({
          id: task.id,
          name: task.name,
        }));
      if (taskOptions.length === 0) {
        return;
      }
      setSubtaskDraft({
        mode: "week",
        week,
        taskOptions,
      });
      setSubtaskError(null);
    },
    [tasks],
  );

  const handleEditSubtask = useCallback(
    (taskId: string, taskName: string, subtaskId: string, subtaskTitle: string, subtaskTimestamp: string, week: WeekInfo) => {
      setSubtaskDraft({
        mode: "task",
        taskId,
        taskName,
        week,
        subtaskId,
        initialTitle: subtaskTitle,
        initialTimestamp: subtaskTimestamp,
      });
      setSubtaskError(null);
    },
    [],
  );

  const handleSubtaskSubmit = useCallback(
    async (taskId: string, payload: { title: string; date: string; time: string; subtaskId?: string }) => {
      setIsSavingSubtask(true);
      setSubtaskError(null);
      try {
        const isEdit = Boolean(payload.subtaskId);
        const response = await fetch(`/api/tasks/${taskId}/subtasks`, {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            ...(isEdit && { subtaskId: payload.subtaskId }),
          }),
        });

        if (!response.ok) {
          const message = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(message?.error ?? (isEdit ? "Failed to update subtask." : "Failed to add subtask."));
        }

        const updated = (await response.json()) as Subtask;

        setTasks((previous) =>
          previous.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: isEdit
                    ? task.subtasks.map((subtask) => (subtask.id === payload.subtaskId ? updated : subtask))
                    : [...task.subtasks, updated],
                }
              : task,
          ),
        );

        setSubtaskDraft(null);
      } catch (error) {
        console.error(`Failed to ${payload.subtaskId ? "update" : "create"} subtask`, error);
        setSubtaskError(error instanceof Error ? error.message : `Failed to ${payload.subtaskId ? "update" : "add"} subtask.`);
      } finally {
        setIsSavingSubtask(false);
      }
    },
    [],
  );

  const handleEditTaskNavigate = useCallback(
    (taskId: string) => {
      router.push(
        `/calendar/${currentQuarter.year}/${currentQuarter.quarter}/tasks/${taskId}/edit`,
      );
    },
    [currentQuarter.quarter, currentQuarter.year, router],
  );

  const handleAddTaskNavigate = useCallback(() => {
    router.push(`/calendar/${currentQuarter.year}/${currentQuarter.quarter}/tasks/new`);
  }, [currentQuarter.quarter, currentQuarter.year, router]);

  return (
    <PlannerShell>
      <HeaderSection
        label={structure.label}
        subtitle={plannerSubtitle}
        onPrevious={() => handleShiftQuarter(-1)}
        onNext={() => handleShiftQuarter(1)}
        extraActions={
          <AddTaskButton type="button" onClick={handleAddTaskNavigate}>
            + Add task
          </AddTaskButton>
        }
      />

      <QuarterTable
        structure={structure}
        tasks={tasks}
        onRemoveTask={handleRemoveTask}
        onEditTask={handleEditTaskNavigate}
        onAddSubtask={handleSubtaskAddRequest}
        onAddSubtaskForWeek={handleSubtaskAddForWeek}
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
          onDismiss={() => {
            setSubtaskDraft(null);
            setSubtaskError(null);
          }}
          onSubmit={({ taskId, title, date, time, subtaskId }) =>
            handleSubtaskSubmit(taskId, { title, date, time, subtaskId })
          }
        />
      ) : null}
    </PlannerShell>
  );
}


