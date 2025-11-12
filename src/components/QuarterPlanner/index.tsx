'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { QuarterKey, buildQuarterStructure, formatISODate, parseISODate, shiftQuarter } from "@/lib/quarter";
import { HeaderSection } from "./HeaderSection";
import { QuarterTable } from "./QuarterTable";
import { Task } from "./types";
import theme from "@/styles/theme";

const PlannerShell = styled.div`
  width: min(1200px, 100%);
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sectionGap};
`;

const plannerSubtitle =
  "Visualise task timelines across weeks. Navigate between quarters and add up to ten tasks to your view.";

type StoredTask = {
  id?: string;
  name?: string;
  start?: string;
  end?: string;
  durationDays?: number;
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
      />
    </PlannerShell>
  );
}


