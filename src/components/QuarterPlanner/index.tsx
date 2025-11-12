'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import {
  QuarterKey,
  WeekInfo,
  buildQuarterStructure,
  formatISODate,
  parseISODate,
  shiftQuarter,
} from "@/lib/quarter";
import { HeaderSection } from "./HeaderSection";
import { QuarterTable } from "./QuarterTable";
import { Task, Subtask } from "./types";
import { SubtaskDialog } from "./Subtasks/SubtaskDialog";
import theme from "@/styles/theme";

const PlannerShell = styled.div`
  width: min(1200px, 100%);
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sectionGap};
`;

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

function normaliseTasks(rawTasks: StoredTask[]): Task[] {
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  const fallbackStart = formatISODate(base);
  const seen = new Set<string>();

  return rawTasks
    .filter((task) => typeof task.name === "string")
    .map((task) => {
      const startISO = task.start
        ? formatISODate(parseISODate(task.start))
        : fallbackStart;

      const startDate = parseISODate(startISO);
      const endISO = task.end
        ? formatISODate(parseISODate(task.end))
        : (() => {
            const end = new Date(startDate);
            const duration = Number(task.durationDays) || 0;
            end.setDate(end.getDate() + Math.max(duration, 0));
            return formatISODate(end);
          })();

      const key = `${task.name}-${startISO}-${endISO}`;
      if (seen.has(key)) {
        return null;
      }
      seen.add(key);

      return {
        id: task.id ?? crypto.randomUUID(),
        name: task.name?.trim() ?? "Untitled Task",
        start: startISO,
        end: endISO,
        subtasks: Array.isArray(task.subtasks)
          ? task.subtasks
              .map((subtask) => {
                if (typeof subtask?.title !== "string" || typeof subtask?.timestamp !== "string") {
                  return null;
                }
                const timestamp = new Date(subtask.timestamp);
                if (Number.isNaN(timestamp.getTime())) {
                  return null;
                }
                return {
                  id: subtask.id ?? crypto.randomUUID(),
                  title: subtask.title.trim() || "Untitled subtask",
                  timestamp: timestamp.toISOString(),
                };
              })
              .filter((subtask): subtask is Subtask => subtask !== null)
          : [],
      };
    })
    .filter((task): task is Task => task !== null);
}

const AddTaskButton = styled.button`
  border-radius: ${theme.radii.pill};
  border: none;
  background: ${theme.colors.accent};
  padding: ${theme.spacing.controlPadding};
  font-weight: ${theme.typography.fontWeightBold};
  transition: ${theme.transitions.primary};
  color: ${theme.colors.accentInverted};
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.primaryHover};
  }
`;

type QuarterPlannerProps = {
  initialQuarter: QuarterKey;
};

export function QuarterPlanner({ initialQuarter }: QuarterPlannerProps) {
  const router = useRouter();

  const [currentQuarter, setCurrentQuarter] = useState<QuarterKey>(initialQuarter);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subtaskDraft, setSubtaskDraft] = useState<{
    taskId: string;
    taskName: string;
    week: WeekInfo;
  } | null>(null);
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
          setTasks(normaliseTasks(payload));
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
        taskId,
        taskName,
        week,
      });
      setSubtaskError(null);
    },
    [],
  );

  const handleSubtaskSubmit = useCallback(
    async (taskId: string, payload: { title: string; date: string; time: string }) => {
      setIsSavingSubtask(true);
      setSubtaskError(null);
      try {
        const response = await fetch(`/api/tasks/${taskId}/subtasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const message = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(message?.error ?? "Failed to add subtask.");
        }

        const created = (await response.json()) as Subtask;

        setTasks((previous) =>
          previous.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: [...task.subtasks, created],
                }
              : task,
          ),
        );

        setSubtaskDraft(null);
      } catch (error) {
        console.error("Failed to create subtask", error);
        setSubtaskError(error instanceof Error ? error.message : "Failed to add subtask.");
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
      />
      {subtaskDraft && subtaskDraft.mode === "task" ? (
        <SubtaskDialog
          key={`task-${subtaskDraft.taskId}-${subtaskDraft.week.start.toISOString()}`}
          mode="task"
          taskName={subtaskDraft.taskName}
          taskId={subtaskDraft.taskId}
          week={subtaskDraft.week}
          availableTasks={[]}
          error={subtaskError}
          isSaving={isSavingSubtask}
          onDismiss={() => {
            setSubtaskDraft(null);
            setSubtaskError(null);
          }}
          onSubmit={({ taskId, title, date, time }) =>
            handleSubtaskSubmit(taskId, { title, date, time })
          }
        />
      ) : null}
    </PlannerShell>
  );
}


