'use client';

import { useEffect, useState, useCallback } from "react";
import { Task } from "../types";
import { normalizeTasks } from "@/lib/task-utils";
import { useToast } from "@/components/shared/Toast/ToastContext";
import { useTranslations } from "@/lib/translations";

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

/**
 * React hook for managing tasks data and operations.
 * Fetches tasks from the API on mount and provides methods to update task state.
 * Handles loading states and automatically normalizes task data from the API.
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const t = useTranslations("toast");

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

  const removeTask = useCallback(
    async (taskId: string) => {
      try {
        const task = tasks.find((t) => t.id === taskId);
        if (!task) {
          return;
        }

        const response = await fetch("/api/tasks", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: taskId }),
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(payload?.error ?? "Failed to delete task");
        }

        setTasks((previous) => previous.filter((task) => task.id !== taskId));
        const message = t.taskDeleted.replace("{{taskName}}", task.name);
        showToast(message);
      } catch (error) {
        console.error("Failed to delete task", error);
        showToast(error instanceof Error ? error.message : "Failed to delete task");
      }
    },
    [tasks, showToast, t.taskDeleted]
  );

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

