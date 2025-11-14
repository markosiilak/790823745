'use client';

import { useEffect, useState, useCallback } from "react";
import { Task } from "../types";
import { normalizeTasks } from "@/lib/task-utils";

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

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadTasks() {
      setIsLoading(true);
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
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadTasks();
    return () => {
      cancelled = true;
    };
  }, []);

  const removeTask = useCallback((taskId: string) => {
    setTasks((previous) => previous.filter((task) => task.id !== taskId));
  }, []);

  const updateTaskSubtasks = useCallback((taskId: string, subtaskUpdater: (subtasks: Task["subtasks"]) => Task["subtasks"]) => {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: subtaskUpdater(task.subtasks),
            }
          : task,
      ),
    );
  }, []);

  return {
    tasks,
    isLoading,
    removeTask,
    updateTaskSubtasks,
    setTasks,
  };
}

