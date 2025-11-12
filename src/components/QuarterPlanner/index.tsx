'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";
import { QuarterKey, buildQuarterStructure, formatISODate, shiftQuarter } from "@/lib/quarter";
import { HeaderSection } from "./HeaderSection";
import { QuarterTable } from "./QuarterTable";
import { Task } from "./types";
import theme from "@/styles/theme";

const MAX_TASKS = 10;

const PlannerShell = styled.div`
  width: min(1200px, 100%);
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sectionGap};
`;

const plannerSubtitle =
  "Visualise task timelines across weeks. Navigate between quarters and add up to ten tasks to your view.";

function createDefaultTasks(): Task[] {
  const today = new Date();
  const twoWeeks = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);

  return [
    {
      id: "kickoff",
      name: "Product Discovery",
      start: formatISODate(today),
      end: formatISODate(twoWeeks),
    },
  ];
}

const AddTaskButton = styled.button`
  border-radius: ${theme.radii.pill};
  border: none;
  padding: 0.65rem 1.6rem;
  font-weight: 600;
  background: ${theme.colors.accent};
  color: #ffffff;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;

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
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [currentQuarter, setCurrentQuarter] = useState<QuarterKey>(initialQuarter);
  const [tasks, setTasks] = useState<Task[]>(() => createDefaultTasks());

  useEffect(() => {
    setCurrentQuarter(initialQuarter);
  }, [initialQuarter]);

  useEffect(() => {
    const rawTask = searchParams.get("task");
    if (!rawTask) {
      return;
    }

    try {
      const payload = JSON.parse(rawTask) as Partial<Task>;
      if (
        typeof payload.name === "string" &&
        typeof payload.start === "string" &&
        typeof payload.end === "string"
      ) {
        setTasks((previous) => {
          if (previous.length >= MAX_TASKS) {
            return previous;
          }
          return [
            ...previous,
            {
              id: crypto.randomUUID(),
              name: payload.name,
              start: payload.start,
              end: payload.end,
            },
          ];
        });
      }
    } catch (error) {
      console.error("Failed to parse task payload from query string", error);
    } finally {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("task");
      const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(nextUrl, { scroll: false });
    }
  }, [pathname, router, searchParams]);

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

      <QuarterTable structure={structure} tasks={tasks} onRemoveTask={handleRemoveTask} />
    </PlannerShell>
  );
}


